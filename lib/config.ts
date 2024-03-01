let pageUrl:string;

if (process.env.NODE_ENV === 'development') {
  pageUrl = 'http://localhost:3000'; // Development API URL
} else {
  pageUrl = 'https://postastic.vercel.app'; // Production API URL
}

export default pageUrl;