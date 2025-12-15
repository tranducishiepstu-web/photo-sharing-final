const BASE_URL = "https://k4dcrq-8081.csb.app";

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
