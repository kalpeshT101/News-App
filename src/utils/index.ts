export const capitalizeFirstLetter = (str: string) => {
  return str && str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const darkColors = {
  background: "#121212",
  primary: "#BB86FC",
  primary2: "#3700b3",
  secondary: "#03DAC6",
  onBackground: "#FFFFFF",
  error: "#CF6679",
};

export const colorEmphasis = {
  high: 0.87,
  medium: 0.6,
  disabled: 0.38,
};

export const NEWS_API_URL = 'https://newsapi.org/v2/everything?q=india&from=2024-07-05&sortBy=publishedAt&apiKey=8d8e62acd6c248109eafe31fef011b3e&page=1&pageSize=100'

export const addUniqueId = (obj : any) => {
  obj.map((news : any) => {
    var ids = "id" + Math.random().toString(16).slice(2)
    news.id = ids;
  })
  return obj;
} 