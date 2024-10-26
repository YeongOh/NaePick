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
