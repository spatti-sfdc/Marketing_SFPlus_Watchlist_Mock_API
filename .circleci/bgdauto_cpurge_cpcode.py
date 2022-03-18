#!/usr/bin/env python

'''
Python Script to be integrated with CircleCI to accomplish :

Akamai Cache Purge - Invalidate for Given CP Codes  

Usage : python bgdauto_cpurge_cpcode.py --cpcodes <cp_Code1> <cp_Code2> --env <staging/production> --host <akamai_api_base_url>
'''

# Requisite module imports
import argparse as ap
import os, akutils


# Defining Argument Parser
def argparser():
    parser = ap.ArgumentParser(prog='bgdauto_cpurge_cpcode.py', usage='%(prog)s --cpcodes <cp_Code1> <cp_Code2>', description="Purge Cache - Invalidate data for given CP Codes")
	
    parser.add_argument('-c', '--cpcodes', '--nargs-int-type', nargs='+', type=int, default=False, dest='cpcodes', required=True, help='Please provide at least one CPCodes which has to be Invalidated.')
	
    parser.add_argument('-e', '--env', type=str, default='staging', dest='env', required=False, choices=['staging', 'production'], help='Please provide environment (staging/production)for Invalidation.')
    
    parser.add_argument('-H', '--host', type=str, default=os.getenv('akamai_host'), dest='host', required=False, help='Please provide the host akamai_base_url')

    parser.add_argument('-cs', '--client_secret', type=str, default=os.getenv('akamai_client_secret'), dest='client_secret', required=False, help='Please provide the host akamai_client_secret')
    
    parser.add_argument('-at', '--access_token', type=str, default=os.getenv('akamai_access_token'), dest='access_token', required=False, help='Please provide the host akamai_access_token')
    
    parser.add_argument('-ct', '--client_token', type=str, default=os.getenv('akamai_client_token'), dest='client_token', required=False, help='Please provide the host akamai_client_token')

    return parser


# Defining the main function - Workflow Trigger
def main():
	parser = argparser()
	params = parser.parse_args()
	
	sobj = akutils.get_akamai_session(params.client_secret, params.access_token, params.client_token)
	invcp = akutils.invalidate_cpcode(params.cpcodes, params.env, params.host, sobj)

	if invcp:
		print(f"\nSuccessfully placed Invalidation Request for : {params.cpcodes} in {params.env} environment.")
	else:
		emsg = f"\nOops! Invalidation Request Unsuccessful for : {params.cpcodes} in {params.env} environment."
		raise Exception(emsg)

# Calling the main-function
if __name__ == '__main__':
	main()