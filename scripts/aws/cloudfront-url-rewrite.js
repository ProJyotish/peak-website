/**
 * CloudFront Function — rewrite directory URLs to index.html
 *
 * S3 REST origins (OAC) do not auto-resolve /blog/ → /blog/index.html.
 * Without this, /blog/ 403/404s and CustomErrorResponses return the SPA shell.
 *
 * Runtime: cloudfront-js-2.0
 */
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else if (!uri.includes(".")) {
    request.uri = uri + "/index.html";
  }

  return request;
}
