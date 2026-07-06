import { DeepLinkPayload } from '../types';

/**
 * Build a modelkit deep link URL based on custom schemes or web standards.
 */
export function buildDeepLink(
  payload: DeepLinkPayload,
  scheme: string = 'modelkit://config'
): { customUri: string; webUri: string } {
  const queryParams = new URLSearchParams();
  queryParams.set('apiKey', payload.apiKey);
  if (payload.baseUrl) queryParams.set('baseUrl', payload.baseUrl);
  queryParams.set('name', payload.name);
  if (payload.description) queryParams.set('description', payload.description);
  queryParams.set('tools', payload.supportedTools.join(','));

  const queryString = queryParams.toString();
  
  // Custom schema protocol
  const customUri = `${scheme}?${queryString}`;
  
  // Web integration protocol (relative/browser query)
  // We use Base64 to make it a neat, single-parameter string for web interoperability if needed
  const base64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const webUri = `${window.location.origin}/?deeplink=${encodeURIComponent(base64Payload)}`;
  
  return { customUri, webUri };
}

/**
 * Parse a deep link URL or query string into a DeepLinkPayload.
 */
export function parseDeepLink(urlOrQuery: string): DeepLinkPayload | null {
  try {
    // Check if it's the Base64 "deeplink" web query parameter
    if (!urlOrQuery.includes(':') && !urlOrQuery.startsWith('?')) {
      // Direct base64 decode attempt
      const json = decodeURIComponent(escape(atob(urlOrQuery)));
      const parsed = JSON.parse(json);
      if (parsed && parsed.apiKey && parsed.name) {
        return {
          apiKey: parsed.apiKey,
          baseUrl: parsed.baseUrl,
          name: parsed.name,
          description: parsed.description,
          supportedTools: Array.isArray(parsed.supportedTools) ? parsed.supportedTools : []
        };
      }
    }

    let searchParams: URLSearchParams;
    if (urlOrQuery.includes('?')) {
      searchParams = new URL(urlOrQuery, 'http://localhost').searchParams;
    } else {
      searchParams = new URLSearchParams(urlOrQuery);
    }

    // Direct check for "deeplink" field first
    const base64Param = searchParams.get('deeplink');
    if (base64Param) {
      return parseDeepLink(base64Param);
    }

    const apiKey = searchParams.get('apiKey');
    const name = searchParams.get('name');
    if (!apiKey || !name) return null;

    const baseUrl = searchParams.get('baseUrl') || undefined;
    const description = searchParams.get('description') || undefined;
    const toolsStr = searchParams.get('tools') || '';
    const supportedTools = toolsStr ? toolsStr.split(',') : [];

    return {
      apiKey,
      baseUrl,
      name,
      description,
      supportedTools
    };
  } catch (e) {
    console.error('Failed to parse deep link', e);
    return null;
  }
}
