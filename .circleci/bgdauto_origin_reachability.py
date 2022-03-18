#Readme:
'''
1. This script is to verify whether one of the datacenter is active or not to serve C360 traffic only.
2. The format to run the script: python3 origin_reachability.py --env prod --origin 1 (Here integer 1 is the origin you want to block, supported values 1 or 2 not specifying this argument checks whether traffic reaching both origins or no.)
3. This script supports only PRODUCTION URL i.e. https://salesforce.com" & UAT URL i.e. "https://www-uat1.salesforce.com" environments.
'''
import http.client as httplib
import requests, argparse, re, time

httplib._MAXHEADERS = 1000 #To avoid http.client.HTTPException: got more than 100 headers exception.

origin1_url=origin2_url=total_count=origin2_count=origin1_count=other_origin_count=0

request_count=500 #Number of requests to try per test.
prod_url="https://salesforce.com"
uat_url="https://www-uat1.salesforce.com"
total_tests=3 #Number of times to retry the test with time interval value defined in seconds for loop_wait_time variable.
loop_wait_time=180 #Here value is seconds of time to wait before running a loop.

parser = argparse.ArgumentParser()
parser.add_argument('-e', '--env', type=str, choices=['uat', 'prod'], required=True, help='Mandatory argument: Pass the environment keyword for which you like run this job.')
parser.add_argument('-o', '--origin', type=int, choices=[0, 1, 2], help='Optional argument: Pass integer 1 to verify traffic block on origin1 and 2 for origin2 but avoid this argument to verify traffic distribution to both origins.', default=0) #0 will be used to evaluate traffic reaching both origin 1 & 2.
args = parser.parse_args()

origin=args.origin

url=prod_url if args.env=="prod" else uat_url
url=f"{url}/?ir=1&prorigin=c360" #NOTE: Here we are testing only US site because the C360(Heroku backend) setup is same for all the regions, testing one region sufficient.

def get_url(url):
    global origin1_url,origin2_url,origin2_count,origin1_count,other_origin_count,total_count
    '''
     NOTE: In below request, User-Agent header value must be PTST to load expected response value
     Here AK-SFDC-DEBUG20 header required by Akamai to let you test the UAT URL and
     Pragma header is required to load the required response headers.
    '''
    r=requests.get(url, headers={'AK-SFDC-DEBUG20':'true',
                                 'Pragma': 'akamai-x-get-extracted-values, no-cache',
                                 'User-Agent': 'PTST',
                                 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                                 'Expires': '0'
                                }
                  )
    try:
         response_header=r.headers['X-Akamai-Session-Info']
         origin_url = re.search(r'PMUSER_ORIGIN_CNAME_C360; value=(\S+)(,)', response_header).group(1)
    except:
         origin_url="CNAME URL not found in response Header" #Don't use "origin" word in this line as its captured for count in below conditions.

    total_count += 1

    if "origin1" in origin_url:
        print(f"[{total_count}] origin1 site: {origin_url} loaded")
        origin1_url=origin_url
        origin1_count += 1

    elif "origin2" in origin_url:
        print(f"[{total_count}] origin2 site: {origin_url} loaded")
        origin2_url=origin_url
        origin2_count += 1

    else:
        print(f"[{total_count}] other origin site: {origin_url} loaded")
        other_origin_url=origin_url
        other_origin_count +=1

def check_result(counter):

    print("\n\n****************** Hit Stats *******************")
    print(f"\nTotal Hits:{total_count}\n\nOrigin1 Hits:{origin1_count}[{(origin1_count/total_count * 100).__round__(2)} %]\n\nOrigin2 Hits:{origin2_count}[{(origin2_count/total_count * 100).__round__(2)} %]\n\nOther Origin Hits:{other_origin_count}[{(other_origin_count/total_count * 100).__round__(2)} %]\n")

    if origin1_count!=0 and origin2_count!=0 and origin==0:
       print(f"\n\n\t\tSuccess!! For {url} Traffic is reaching both origin1: {origin1_url} & origin2: {origin2_url}..!\n")
       exit()

    elif origin1_count==0 and origin==1 and origin2_count!=0:
       print(f"\nSuccess!! For {url} Traffic to origin1 is successfully blocked..!\n")
       exit()

    elif origin2_count==0 and origin==2 and origin1_count!=0:
       print(f"\nSuccess!! For {url} Traffic to origin2 is successfully blocked..!\n")
       exit()

    elif counter==total_tests:
         exit_error=f"\n\n\t\tAborted !! {total_tests} times tested with {loop_wait_time} seconds interval but traffic not distributed as expected..!\n"
         raise Exception(exit_error)
    else:
        print ("\n---------------Traffic not distributing as expected, Testing again..!-------------------------\n")

def main():
    counter=0
    while counter<total_tests:
        counter+=1
        print(f"\n\n----------- Test attempts: {counter}/{total_tests} & script starts in {loop_wait_time} seconds -------------\n")
        time.sleep(loop_wait_time)

        for _ in range(request_count):
            get_url(url)

        check_result(counter)
        global total_count,origin2_count,origin1_count,other_origin_count
        total_count=origin2_count=origin1_count=other_origin_count=0

# Calling the main-function
if __name__ == '__main__':
	main()
