const BASE_URL = "https://4ck2j9-8081.csb.app"; // gọi API để lấy/gửi DL với BE

async function fetchModel(url) {
  try {
    const response = await fetch(BASE_URL + url, {
      credentials: "include", // gửi kèm cookie session
    });

    if (!response.ok) {
      throw new Error("Backend error: " + response.statusText);
    }

    return await response.json();
  } catch (err) {
    console.error("fetchModel error:", err);
    throw err;
  }
}

export default fetchModel;
