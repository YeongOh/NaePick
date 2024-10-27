export async function fetchYoutubeTitle(
  videoURL: string
): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://noembed.com/embed?dataType=json&url=${videoURL}`
    );
    const data: { title: string } = await response.json();
    return data.title;
  } catch (error) {
    console.log(error);
  }
}

export function extractYoutubeId(youtubeURL: string) {
  // https://www.youtube.com/embed/fqabW3WRUbw?si=rDxkM86-BU3DnFRo"
  // https://www.youtube.com/watch?v=fqabW3WRUbw&ab_channel=WebDevSimplified
  // https://youtube.com/watch?v=fqabW3WRUbw&ab_channel=WebDevSimplified
  // https://youtu.be/fqabW3WRUbw?si=Eh8vPRuXYNgeVC2n
  // https://www.youtu.be/fqabW3WRUbw?si=Eh8vPRuXYNgeVC2n
  try {
    const urlObj = new URL(youtubeURL);
    let videoId = null;

    // Check for the different URL formats
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2];
      }
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      }
    }

    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.split('/')[1];
    }

    return null;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null; // Return null if the URL is invalid
  }
}

export function getYoutubeThumbnailURL(
  youtubeID: string,
  resolution: 'small' | 'medium'
) {
  if (youtubeID === '') return '';
  if (resolution === 'small')
    return `https://img.youtube.com/vi/${youtubeID}/mqdefault.jpg`;
  if (resolution === 'medium')
    return `https://img.youtube.com/vi/${youtubeID}/hqdefault.jpg`;
}
