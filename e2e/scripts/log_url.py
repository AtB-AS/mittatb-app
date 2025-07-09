def request(flow):
    if "staging.api.mittatb.no" in flow.request.pretty_host:
        print(f"REQUEST: {flow.request.method} {flow.request.url}\n")
    with open("requests.log", "a") as my_request:
        if "staging.api.mittatb.no" in flow.request.pretty_host:
            my_request.write(f"REQUEST: {flow.request.method} {flow.request.url}\n")
    with open("requests_token.log", "a") as my_token:
        if ("staging.api.mittatb.no" in flow.request.pretty_host) and ("token/v1/" in flow.request.url):
            my_token.write(f"REQUEST: {flow.request.method} {flow.request.url}\n")