function Saml11(token) {
	this.token = token;
}

Saml11.prototype.getClaims = function() 
{
	var tokenXml = (new XMLSerializer()).serializeToString(this.token.firstChild);

	if ($(tokenXml).find('xenc\\:EncryptedData').length > 0) {
		throw 'token is encrypted, cannot read claims';
	}

	var claims = [];
	$(tokenXml).find('saml\\:Attribute').each(function(){
		var claimType = $(this).attr('AttributeNamespace') + '/' + $(this).attr('AttributeName');
		var claimValue = $(this).find('saml\\:AttributeValue').text();
		claims.push({'type': claimType, 'value': claimValue});
	});

	return claims;
}