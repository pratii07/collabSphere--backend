const axios = require('axios');

async function test() {
  try 
    const res = await axios.post('http://localhost:8000/api/gemini/explain', {
      text: "function hello() { console.log('world'); }"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

test();
