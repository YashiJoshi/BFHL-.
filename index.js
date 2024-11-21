import express from "express";
import bodyParser from "body-parser";
import mime from "mime-types";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to check if a number is prime
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

// Function to handle the file (base64 to mime type and file size)
const handleFile = (fileBase64) => {
  if (!fileBase64) return { file_valid: false };
  try {
    const buffer = Buffer.from(fileBase64, "base64");
    const mimeType = mime.lookup(buffer); // Get mime type from mime-types package
    return {
      file_valid: !!mimeType,
      file_mime_type: mimeType || "unknown",
      file_size_kb: (buffer.length / 1024).toFixed(2), // Calculate file size in KB
    };
  } catch (err) {
    return { file_valid: false };
  }
};

// POST endpoint to process the data and file
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // Validate that "data" is an array
  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input" });
  }

  // Separate numbers and alphabets
  const nums = data.filter((item) => !isNaN(item));
  const chars = data.filter((item) => /^[a-zA-Z]$/.test(item));

  // Extract lowercase alphabets and find the highest one
  const lowercase = chars.filter((char) => /^[a-z]$/.test(char));
  const highestLowercase = lowercase.sort().slice(-1);

  // Check if any prime numbers are found in the data
  const hasPrime = nums.some((n) => isPrime(Number(n)));

  // Process the file (if any)
  const fileDetails = handleFile(file_b64);

  // Send the response
  res.json({
    is_success: true,
    user_id: "your_name_ddmmyyyy", // Replace with your name and birthdate
    email: "your_email@domain.com", // Replace with your email
    roll_number: "your_roll_number", // Replace with your roll number
    numbers: nums,
    alphabets: chars,
    highest_lowercase_alphabet: highestLowercase,
    is_prime_found: hasPrime,
    ...fileDetails,
  });
});

// GET endpoint to return a simple operation code
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
