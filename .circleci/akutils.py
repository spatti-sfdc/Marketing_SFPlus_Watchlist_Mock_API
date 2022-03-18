'''
[akutils : akamai-utils] A Python module for Akamai Utilities
'''

# Requisite module imports
import requests, json
from akamai.edgegrid import EdgeGridAuth


# Method : Create an Akamai Session with provided Auth
def get_akamai_session(client_secret, access_token, client_token):
    try:
        session = requests.Session()
        session.auth = EdgeGridAuth(
                        client_secret = client_secret,
                        access_token = access_token,
                        client_token = client_token
                        )
        
        return session
    except Exception as e:
        emsg= f"\n Oops! Can not create Akamai Session : {e}"
        print(emsg)
        


# Method : Switch Traffic in an Akamai GTM for provided Origin
def switch_origin(dname, pname, oname, switch, host, session):
    base_url = f"https://{host}"
    akapi = f"/config-gtm/v1/domains/{dname}/properties/{pname}"
    url = f"{base_url}{akapi}"
    
    tswitchable = False
    print(f"\nSwitching Traffic for : {dname}/{pname}/{oname}")
    
    try:
        # Getting GTM Property Object
        pobj = session.get(url).json()
        
        # Sample GTM Property Object : https://developer.akamai.com/api/web_performance/global_traffic_management/v1.html#getproperty
        
        for tt in pobj["trafficTargets"]:
            if oname in tt['handoutCName']:
                tswitchable = True
                tt['enabled'] = switch
                
        if not tswitchable:
            emsg= f"Oops! Parameters seems to be invalid !"
            raise Exception(emsg)
        
        # Switching Traffic for Origin{oname} - API Ref : https://developer.akamai.com/api/web_performance/global_traffic_management/v1.html#putproperty
        session.headers.update({"Content-Type": "application/json"})
        straffic = session.put(url, data=json.dumps(pobj))
        
        return straffic.ok
    except Exception as e:
        print(f"\n Oops! Can't Reach Akamai APIs at the moment : {e}")
        
        return tswitchable


# Method : Retrive Phased-Release Cloudlet Rules for a PolicyId and Version
def get_prc_rules(base_url, session, policyId, version):
    akapi_url = f"https://{base_url}/cloudlets/api/v2/policies/{policyId}/versions/{version}"
    prc_rules = {'rules': []}

    try:
        # Getting Policy Version Details from Akamai
        pv = session.get(akapi_url).json()
        # Sample Response : https://developer.akamai.com/api/web_performance/cloudlets/v2.html#getpolicyversion
        prc_rules['base_url'] = pv['activations'][0]['propertyInfo']['name']
        
        for mr in pv['matchRules']:
            prc_rules['rules'].append(f"{mr['name']} - {mr['matches'][0]['matchValue']} - {mr['forwardSettings']['originId']} - {mr['forwardSettings']['percent']}")

    except Exception as e:
        print(f"\n Oops! Can't Reach Akamai APIs at the moment : {e}")

    return prc_rules


# Method : Invalidate data for Given CP-Codes
def invalidate_cpcode(cpcodes, env, host, session):
    base_url = f"https://{host}"
    akapi = f"/ccu/v3/invalidate/cpcode/{env}"
    url = f"{base_url}{akapi}"

    print(f"\nPurging Cache for CP-Code: {cpcodes} in {env} environment.")
    
    # Crafting CP Object - API Ref : https://developer.akamai.com/api/core_features/fast_purge/v3.html#postinvalidatecpcode
    cpobj = {
        "objects" :
            cpcodes
        }
    
    try:
        # Placling request over Akamai API to invalidate given CP-Code
        session.headers.update({"Content-Type": "application/json"})
        cp_inv = session.post(url, data=json.dumps(cpobj))
        return cp_inv.ok

    except Exception as e:
        print(f"\n Oops! Can't Reach Akamai APIs at the moment : {e}")
        return False
