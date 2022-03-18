import urllib.request
import json
import argparse
import subprocess


""" 
This script works as per the select mode , as of now we have single mode [origin_git_hash_check] which would 
take additional origin headers of (origin1 and origin2) and would verify if the same githash has been on both the 
origins or not.

"""


def argument_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('-u', default=False, dest='host_url', required=True,
                        help='Specify the host url  Ex:https://www.salesforce.com/c/status.json')
    parser.add_argument('-f', default=False, dest='first_header', required=True,
                        help='Specify the first header value Ex: test-uat:*Origin1')
    parser.add_argument('-s', default=False, dest='second_header', required=True,
                        help='Specify the first header value Ex: test-uat:*Origin2')
    parser.add_argument('-c', default=None, dest='git_hash', required=False,
                        help='Specify the git commit hash value Ex: bbfd3e19a8c6833c00fe96a68b97bda938618e05')
    parser.add_argument('-m', default=None, dest='script_mode', required=False,
                        help='Specify the script mode,i.e which function to specifically run Ex: origin_git_hash_check')
    return parser


def execute_shell_command(cmd):
    """
    To execute bash command and return output and status code.
    :param cmd: Command to be executed
    :return: output of the command along with its status code
    """
    print("-------------------------------------------------------")
    print("Command: [{}]".format(cmd))
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    if err:
        print("std-err: [{}]".format(err))
    return output.decode('utf-8').strip(),p.returncode

def validate_prod_commit_exists(host_url, first_header):
    f_header = {first_header.split(':')[0]:  first_header.split(':')[1], 'AK-SFDC-DEBUG20': 'true'}
    try:
        """
        We would hit the origin 1 using its header and fetch the deployed production git hash, we then use that to check if the current branch 
        contains that production git hash or not , if it contains we will allow the deployment to int or else we will not allow the deployment to int
        """
        f_req = urllib.request.Request(host_url, headers=f_header)
        f_response = urllib.request.urlopen(f_req).read()
        f_output = json.loads(f_response.decode('utf-8'))
        prod_commit_hash=f_output['githash']
        print("\n==============================================================")
        print("Current Production Commit [{}]".format(prod_commit_hash))
        branch_info, b_status_code = execute_shell_command("git rev-parse --abbrev-ref HEAD")
        print("Current Branch Details [{}] with status code [{}]".format(branch_info, b_status_code))
        check_git_hash = "git branch --contains" + " " + prod_commit_hash + " " + "|" + " " + "grep" + " " + '"{}"'.format(branch_info)
        verify_prod_commit, p_status_code = execute_shell_command(check_git_hash)
        print("search query result [{}] and it has returned with status code [{}]".format(verify_prod_commit, p_status_code))
        print("==============================================================\n")

        if b_status_code == 0 and p_status_code == 0:
            print("\nAll Good, we did find the production commit [{}] in this current branch/tag [{}] used for this build\n".format(prod_commit_hash, branch_info))
            status = 0 
        else:
            print("\nWe did not find the production commit [{}] in this current branch/tag [{}] used for this build, please check\n".format(prod_commit_hash, branch_info))
            status = 1   
    except:
        print("There is an error fetching the git hash details / running git commands")
        status = 1
    print("\n==============================================================\n")    
    return status


def check_origin_git_hash(host_url, first_header, second_header, git_hash):
    """
    :param host_url:  This host url should be the url endpoint which has the json file which has the details of git hash
    :param first_header: This param hold the header value to connect to origin1 directly using the same host url above
    :param second_header: This param hold the header value to connect to origin2 directly using the same host url above
    :param git_hash: In case of Deployment , we can compare both origins git hash with the pipeline git hash and take action
    :return: The function would return the status '0' (success) or '1' (failure) based on the validations
    """
    print("\nInput Provided :\nHost Url [{}]\nFirst Header  [{}]\n"
          "Second Header [{}]\nGit hash to compare against [{}]\n".format(host_url, first_header, second_header, git_hash))
    f_header = {first_header.split(':')[0]:  first_header.split(':')[1], 'AK-SFDC-DEBUG20': 'true'}
    s_header = {second_header.split(':')[0]: second_header.split(':')[1], 'AK-SFDC-DEBUG20': 'true'}

    try:
        """
        Our logic is fairly straight forward , we would hit the respective origins and fetch the deployed git hash on 
        them. we would compare with both the origins and validate if they match or not 
        In addition we will also make an addition comparision with git hash (ideally the cirlcleci pipeline) deployment 
        git hash , this would make the validation if the correct code (git hash is deployed in both the origins or not)
        """
        f_req = urllib.request.Request(host_url, headers=f_header)
        f_response = urllib.request.urlopen(f_req).read()
        f_output = json.loads(f_response.decode('utf-8'))

        s_req = urllib.request.Request(host_url, headers=s_header)
        s_response = urllib.request.urlopen(s_req).read()

        s_output = json.loads(s_response.decode('utf-8'))

        if git_hash is not None:
            if f_output['githash'] == s_output['githash'] == git_hash:
                print("All Good, git commit hash {} is same across both the origins post deployment and is also same"
                      " as the git hash [{}] used for comparision\n".format(git_hash,git_hash))
                status = 0
            elif f_output['githash'] == s_output['githash']:
                print("Git commit hash {} is same across both the origins post deployment,"
                      "\nhowever it is different from current commit {} "
                      "used for comparision\n".format(f_output['githash'],git_hash))
                status = 1
            else:
                print("Current Deployment git commit hash {} is not same across both the "
                      "origins \n[origin1: {}, origin2: {} ] post deployment , "
                      "please check \n".format(git_hash, f_output['githash'], s_output['githash']))
                status = 1
        else:
            if f_output['githash'] == s_output['githash']:
                print("All Good, Git commit hash [{}] is same across both the origins\n".format(f_output['githash']))
                status = 0
            else:
                print("Git commit hash is not same across both the "
                      "origins \n[origin1: [{}], origin2: [{}] ]"
                      "please check \n".format(f_output['githash'], s_output['githash']))
                status = 1
        return status
    except:
        status = 1
        print("There is an error fetching the git hash details from the origins")
        return status


def main():
    parser = argument_parser()
    input_params = parser.parse_args()
    """
    As a provision to extend this script for different use cases we have come up with mode concept , basing on the 
    input mode the script would perform respective action
    """
    if input_params.script_mode == 'origin_git_hash_check':
        return_status=check_origin_git_hash(input_params.host_url, input_params.first_header, input_params.second_header, input_params.git_hash)
        if return_status != 0:
            print("commit hash is different, something went wrong with the deployment , please check manually\n")
            exit(1)
    elif input_params.script_mode == 'validate_prod_commit_exists':
        return_status=validate_prod_commit_exists(input_params.host_url, input_params.first_header)
        if return_status != 0:
            print("\nLooks Like the branch merge was missed after the last production release , please check manually \n")
            print("\n==============================================================\n")
            exit(1)
    else:
        print("Mode {} not currently supported".format(input_params.script_mode))


if __name__ == '__main__':
    main()