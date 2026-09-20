/**
 * Parses repository URLs into structured metadata without external API calls.
 */
export function parseRepoUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { valid: false, originalUrl: inputUrl || '' };
  }

  let cleanUrl = inputUrl.trim();
  
  // Add https protocol if missing
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  try {
    const parsed = new URL(cleanUrl);
    const hostname = parsed.hostname.toLowerCase();
    const pathSegments = parsed.pathname.split('/').filter(Boolean);

    let platform = 'custom';
    if (hostname.includes('github.com')) platform = 'github';
    else if (hostname.includes('gitlab.com')) platform = 'gitlab';
    else if (hostname.includes('bitbucket.org')) platform = 'bitbucket';
    else if (hostname.includes('azure.com') || hostname.includes('visualstudio.com')) platform = 'azure';

    let owner = '';
    let repo = '';

    if (pathSegments.length >= 2) {
      owner = pathSegments[0];
      repo = pathSegments[1].replace(/\.git$/i, '');
    } else if (pathSegments.length === 1) {
      owner = hostname;
      repo = pathSegments[0].replace(/\.git$/i, '');
    } else {
      owner = hostname;
      repo = 'repository';
    }

    const fullName = `${owner}/${repo}`;

    return {
      valid: true,
      originalUrl: inputUrl,
      url: cleanUrl,
      domain: hostname,
      platform,
      owner,
      repo,
      fullName,
      title: repo,
    };
  } catch {
    // Fallback for simple string inputs like "my-org/my-repo"
    const parts = cleanUrl.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return {
        valid: true,
        originalUrl: inputUrl,
        url: `https://github.com/${parts[0]}/${parts[1]}`,
        domain: 'github.com',
        platform: 'github',
        owner: parts[0],
        repo: parts[1],
        fullName: `${parts[0]}/${parts[1]}`,
        title: parts[1],
      };
    }

    return {
      valid: false,
      originalUrl: inputUrl,
      title: cleanUrl,
    };
  }
}
