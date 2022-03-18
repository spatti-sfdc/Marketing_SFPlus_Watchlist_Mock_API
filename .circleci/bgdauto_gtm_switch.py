#!/usr/bin/env python

'''
Python Script to be integrated with CircleCI to accomplish :

Akamai Global Traffic Manager(GTM) traffic switch between Origins

Usage : python bgdauto_gtm_switch.py --domain <domain_name> --property <property_name> --origin <origin_name> --switch <enable/disable>
'''

# Requisite module imports
import argparse as ap
import os, akutils


# Defining Argument Parser
def argparser():
    parser = ap.ArgumentParser(prog='bgdauto_gtm_switch.py', usage='%(prog)s --domain <domain_name> --property <property_name> --origin <origin_name> --switch <enable/disable>', description="Switch Traffic for an Origin of an Akamai GTM")
	
    parser.add_argument('-d', '--domain', default=False, dest='dname', required=True,
                        help='Please provide the domain name associated with the GTM')
						
    parser.add_argument('-p', '--property', default=False, dest='pname', required=True,
                        help='Please provide the property name associated with the GTM')
	
    parser.add_argument('-o', '--origin', default=False, dest='oname', required=True,
                        help='Please provide the origin name associated with the GTM to be switched')
    
    parser.add_argument('-s', '--switch', default=False, dest='switch', required=True, choices=['enable', 'disable'], help='Please specify whether to Enable or Disable the Origin.')
    
    parser.add_argument('-H', '--host', type=str, default=os.getenv('akamai_host'), dest='host', required=False, help='Please provide the host akamai_base_url')

    parser.add_argument('-cs', '--client_secret', type=str, default=os.getenv('akamai_client_secret'), dest='client_secret', required=False, help='Please provide the host akamai_client_secret')
    
    parser.add_argument('-at', '--access_token', type=str, default=os.getenv('akamai_access_token'), dest='access_token', required=False, help='Please provide the host akamai_access_token')
    
    parser.add_argument('-ct', '--client_token', type=str, default=os.getenv('akamai_client_token'), dest='client_token', required=False, help='Please provide the host akamai_client_token')

    return parser


# Defining the main function - Workflow Trigger
def main():
	parser = argparser()
	params = parser.parse_args()
	
	# Setting Switch Flag
	if 'disable' in params.switch:
		params.switch = False
	elif 'enable' in params.switch:
		params.switch = True
	else:
		emsg = f"\nOops! Invalid Switch Passed : {params.switch}"
		raise Exception(emsg)
    
	sobj = akutils.get_akamai_session(params.client_secret, params.access_token, params.client_token)
	tswitched = akutils.switch_origin(params.dname, params.pname, params.oname, params.switch, params.host, sobj)

	if tswitched:
		print(f"\nTraffic Switching Successful for : {params.dname}/{params.pname}/{params.oname}")
	else:
		emsg = f"\nTraffic Switching NOT Successful for : {params.dname}/{params.pname}/{params.oname}"
		raise Exception(emsg)

# Calling the main-function
if __name__ == '__main__':
	main()