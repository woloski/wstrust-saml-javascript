function WsTrust(stsUrl) {
    this.stsUrl = stsUrl;
}

WsTrust.prototype.requestSecurityToken = function(username, pass, appliesTo, encrypted, callback) 
	{
		var keyType = encrypted ? "http://docs.oasis-open.org/ws-sx/ws-trust/200512/SymmetricKey" : 
								  "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer"

		var rst = "<s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\">" +
		"<s:Header>" +
        "<a:Action s:mustUnderstand=\"1\">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</a:Action>" +
        "<a:To s:mustUnderstand=\"1\">{0}</a:To>" +
        "</s:Header>" +
        "<s:Body>" +
            "<trust:RequestSecurityToken xmlns:trust=\"http://docs.oasis-open.org/ws-sx/ws-trust/200512\">" +
                "<wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\">" +
                    "<a:EndpointReference>" +
                        "<a:Address>{1}</a:Address>" +
                    "</a:EndpointReference>" +
            "</wsp:AppliesTo>" +
            "<trust:KeyType>" + keyType + "</trust:KeyType>" +
            "<trust:RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</trust:RequestType>" +
            "</trust:RequestSecurityToken>" +
        "</s:Body>" +
       "</s:Envelope>";
			
		var body = rst.format(this.stsUrl, appliesTo);

		$.ajax({
			url: this.stsUrl,
			data: body,
			type: 'POST',
            beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(username + ":" + pass));
				xhr.setRequestHeader("Content-Type", "application/soap+xml; charset=utf-8");
			},
			timeout: 5000,
			dataType: 'xml',
			success: function(data, status){
				callback.success(data);
			},
			error: function(qXHR, textStatus, errorThrown){
			   callback.error(qXHR)
			}
		});
	}

