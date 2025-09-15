import { TransactionData } from "./types";

export interface Expense {
  store: string;
  cost: number;
  category: string;
  description: string;
  user: string; // User id who added the expense
  houseCode: string; // House id to which the expense is assigned
  date: Date;
  _id: string;
  storeName: string;
  receipt: string;
}

export const menu = [
  {
    id: 5,
    title: "Home",
    url: "/",
    icon: "/home.svg",
  },
  {
    id: 6,
    title: "Users",
    url: "/users",
    icon: "/userNames.svg",
    restricted: true,
  },
  {
    id: 1,
    title: "Expenses",
    url: "/expenses",
    icon: "/expenses.svg",
  },
  {
    id: 2,
    title: "Houses",
    url: "/houses",
    icon: "/houses.svg",
  },
  // {
  //   id: 3,
  //   title: "Stores",
  //   url: "/stores",
  //   icon: "/storemenu.svg",
  // },
  {
    id: 4,
    title: "Balance",
    url: "/balance",
    icon: "/balances.svg",
  },
  {
    id: 7,
    title: "Notes",
    url: "/notes",
    icon: "/notes.svg",
  },
];

// export const dummyExpenses: Expense[] = [
//   {
//     store: "store1",
//     _id: "expense1",
//     cost: 50.25,
//     category: "Groceries",
//     description: "Weekly grocery shopping",
//     user: "user123",
//     houseCode: "house456",
//     date: new Date("2023-10-15"),
//     storeName: "Grocery Store A",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store2",
//     _id: "expense2",
//     cost: 30.5,
//     category: "Dining Out",
//     description: "Dinner with friends",
//     user: "user456",
//     houseCode: "house789",
//     date: new Date("2023-10-18"),
//     storeName: "Restaurant XYZ",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store3",
//     _id: "expense3",
//     cost: 200.0,
//     category: "Electronics",
//     description: "New headphones purchase",
//     user: "user789",
//     houseCode: "house123",
//     date: new Date("2023-10-20"),
//     storeName: "Electronics Store B",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store4",
//     _id: "expense4",
//     cost: 75.99,
//     category: "Clothing",
//     description: "Shopping for winter clothes",
//     user: "user123",
//     houseCode: "house456",
//     date: new Date("2023-10-22"),
//     storeName: "Clothing Store C",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store5",
//     _id: "expense5",
//     cost: 40.75,
//     category: "Transportation",
//     description: "Fuel for the car",
//     user: "user456",
//     houseCode: "house789",
//     date: new Date("2023-10-24"),
//     storeName: "Gas Station X",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store6",
//     _id: "expense6",
//     cost: 60.0,
//     category: "Home Improvement",
//     description: "Paint and tools",
//     user: "user789",
//     houseCode: "house123",
//     date: new Date("2023-10-26"),
//     storeName: "Hardware Store Y",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store7",
//     _id: "expense7",
//     cost: 25.3,
//     category: "Healthcare",
//     description: "Medications and vitamins",
//     user: "user123",
//     houseCode: "house456",
//     date: new Date("2023-10-28"),
//     storeName: "Pharmacy Z",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store8",
//     _id: "expense8",
//     cost: 15.99,
//     category: "Books",
//     description: "New novel purchase",
//     user: "user456",
//     houseCode: "house789",
//     date: new Date("2023-10-30"),
//     storeName: "Bookstore D",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store9",
//     _id: "expense9",
//     cost: 35.5,
//     category: "Pets",
//     description: "Pet food and supplies",
//     user: "user789",
//     houseCode: "house123",
//     date: new Date("2023-11-02"),
//     storeName: "Pet Store E",
//     storeImg: "https://picsum.photos/200/300",
//   },
//   {
//     store: "store10",
//     _id: "expense10",
//     cost: 10.75,
//     category: "Dining Out",
//     description: "Morning coffee",
//     user: "user123",
//     houseCode: "house456",
//     date: new Date("2023-11-04"),
//     storeName: "Coffee Shop F",
//     storeImg: "https://picsum.photos/200/300",
//   },
// ];

export const chartBoxUserExpense = {
  color: "#8884d8",
  icon: "/userIcon.svg",
  title: "My Expenses",
  number: "$241.5",
  dataKey: "expenses",
  percentage: 45,
  chartData: [
    { name: "Sun", expenses: 400 },
    { name: "Mon", expenses: 600 },
    { name: "Tue", expenses: 500 },
    { name: "Wed", expenses: 700 },
    { name: "Thu", expenses: 400 },
    { name: "Fri", expenses: 500 },
    { name: "Sat", expenses: 450 },
  ],
};

export const chartBoxStoreExpense = {
  color: "skyblue",
  icon: "/productIcon.svg",
  title: "Popular Category",
  number: "10047.76",
  dataKey: "expenses",
  percentage: 21,
  chartData: [
    {
      name: "Butcher",
      expenses: 4233.69,
    },
    {
      name: "Grocery",
      expenses: 1399.15,
    },
    {
      name: "Other",
      expenses: 10047.76,
    },
  ],
};
export const chartBoxHouseExpense = {
  color: "teal",
  icon: "/revenueIcon.svg",
  title: "House Expense",
  number: "$564.32",
  dataKey: "expenses",
  percentage: -12,
  chartData: [
    { name: "Jun", expenses: 400 },
    { name: "July", expenses: 600 },
    { name: "August", expenses: 500 },
    { name: "Sept", expenses: 700 },
    { name: "Oct", expenses: 400 },
    { name: "Nov", expenses: 500 },
  ],
};
export const chartBoxConversion = {
  color: "gold",
  icon: "/conversionIcon.svg",
  title: "Popular Store",
  number: "2.6",
  dataKey: "expenses",
  percentage: 12,
  chartData: [
    { name: "Sun", ratio: 400 },
    { name: "Mon", ratio: 600 },
    { name: "Tue", ratio: 500 },
    { name: "Wed", ratio: 700 },
    { name: "Thu", ratio: 400 },
    { name: "Fri", ratio: 500 },
    { name: "Sat", ratio: 450 },
  ],
};

export const barChartBoxUserExpenseLastSixMonths = {
  title: "Last Six Months Expenses",
  color: "#23b576",
  dataKey: "expenses",
  chartData: [
    {
      name: "Jan",
      expenses: 4000,
    },
    {
      name: "Feb",
      expenses: 3000,
    },
    {
      name: "Mar",
      expenses: 2000,
    },
    {
      name: "Apr",
      expenses: 2780,
    },
    {
      name: "May",
      expenses: 1890,
    },
    {
      name: "Jun",
      expenses: 2390,
    },
    {
      name: "Jul",
      expenses: 3490,
    },
  ],
};

// last 3 months all user house expense
export const barChartBoxAllUser = {
  title: "Member Contribution This Month",
  color: "green",
  dataKey: "expenses",
  chartData: [
    {
      name: "Shomrat",
      expenses: 3000,
    },
    {
      name: "Rizwan",
      expenses: 4000,
    },

    {
      name: "Nahid",
      expenses: 2000,
    },
    {
      name: "Rashed",
      expenses: 2780,
    },
  ],
};

export const userRows = [
  {
    active: true,
    id: "653686b3d426931967abc8e3",
    email: "rizwan@example.com",
    username: "RizwanKabir",
    houseCodes: ["0496", "0000"],
    image:
      "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    __v: 3,
  },
  {
    active: false,
    id: "6536961fc637a922e7759f87",
    email: "user@user.com",
    username: "user",
    houseCodes: ["0496", "0411"],
    __v: 2,
  },
  {
    active: false,
    id: "6536bb2e9c205ca79567bc3a",
    email: "user1@user.com",
    username: "user1",
    houseCodes: ["0496"],
    __v: 1,
  },
  {
    active: false,
    id: "6536c0e5241b5116b52381c7",
    email: "user2@user.com",
    username: "user2",
    houseCodes: ["0496", "0000"],
    __v: 2,
  },
  {
    active: false,
    id: "65398610ac78c286400a884e",
    email: "pranto@outlook.de",
    username: "sizan",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "65398841ac78c286400a8856",
    email: "pranto1@outlook.de",
    username: "sizan1",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "65398883ac78c286400a885a",
    email: "kabir@gmail.com",
    username: "sizan3",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "6539965fac78c286400a8863",
    email: "dusseldorf.rampagers@gmail.com",
    username: "sizan4",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653ee3e550a67924b9b9593c",
    email: "rizwankabirsizannnnn@gmail.com",
    username: "kabirbbb",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653ee400e1aa1591cf2101b7",
    email: "dusseldorf.rampagerdds@gmail.com",
    username: "sizanss",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653ee47ce1aa1591cf2101bb",
    email: "dusseldorf.rampageddrs@gmail.com",
    username: "Rizwangg",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653ee4fbe1aa1591cf2101bf",
    email: "rizwankabirsizansdadd@gmail.com",
    username: "adminaddDA",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653ee576e1aa1591cf2101c3",
    email: "sizayfgfgyugygn@hsrw.org",
    username: "ygfyugguhiugh",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653ee6e0fe08c9b716932f57",
    email: "dusseldorf.ramfdsgasdfdsafpagers@gmail.com",
    username: "adminfdsafdas",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653eebd9f55aedd20883c370",
    email: "rizwankabirsizanvvb@gmail.com",
    username: "nMnasv",
    houseCodes: [],
    __v: 0,
  },
  {
    active: false,
    id: "653eebfef55aedd20883c374",
    email: "bigziauddin@gmail.com",
    username: "somrat",
    houseCodes: [],
    __v: 0,
  },
  {
    id: "653fc236707f83b5aaabca92",
    email: "rizwankabirsizan@gmail.com",
    username: "rizwan",
    active: true,
    houseCodes: [],
    __v: 0,
  },
];

//   export const userRows = [
//     {
//       id: 1,
//       img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//       lastName: "Hubbard",
//       firstName: "Eula",
//       email: "kewez@@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 2,
//       img: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Manning",
//       firstName: "Stella",
//       email: "comhuhmit@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 3,
//       img: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Greer",
//       firstName: "Mary",
//       email: "ujudokon@hottmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 4,
//       img: "https://images.pexels.com/photos/871495/pexels-photo-871495.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Williamson",
//       firstName: "Mildred",
//       email: "tinhavabe@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 5,
//       img: "https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Gross",
//       firstName: "Jose",
//       email: "gobtagbes@yahoo.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 6,
//       img: "https://images.pexels.com/photos/769745/pexels-photo-769745.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Sharp",
//       firstName: "Jeremy",
//       email: "vulca.eder@mail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 7,
//       img: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Lowe",
//       firstName: "Christina",
//       email: "reso.bilic@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 8,
//       img: "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Dean",
//       firstName: "Garrett",
//       email: "codaic@mail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 9,
//       img: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Parsons",
//       firstName: "Leah",
//       email: "uzozor@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 10,
//       img: "https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Reid",
//       firstName: "Elnora",
//       email: "tuhkabapu@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 11,
//       img: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Dunn",
//       firstName: "Gertrude",
//       email: "gibo@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//       verified: true,
//     },
//     {
//       id: 12,
//       img: "https://images.pexels.com/photos/774095/pexels-photo-774095.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Williams",
//       firstName: "Mark",
//       email: "tic.harvey@hotmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 13,
//       img: "https://images.pexels.com/photos/761977/pexels-photo-761977.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Cruz",
//       firstName: "Charlotte",
//       email: "ceuc@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 14,
//       img: "https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1600",
//       lastName: "Harper",
//       firstName: "Sara",
//       email: "bafuv@hotmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 15,
//       img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
//       lastName: "Griffin",
//       firstName: "Eric",
//       email: "ubi@gmail.com",
//       phone: "123 456 789",
//       createdAt: "01.02.2023",
//     },
//   ];

//   export const products = [
//     {
//       id: 1,
//       img: "https://store.sony.com.au/on/demandware.static/-/Sites-sony-master-catalog/default/dw1b537bbb/images/PLAYSTATION5W/PLAYSTATION5W.png",
//       title: "Playstation 5 Digital Edition",
//       color: "white",
//       producer: "Sony",
//       price: "$250.99",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//     {
//       id: 2,
//       img: "https://www.pngmart.com/files/6/Dell-Laptop-PNG-Image.png",
//       title: "Dell Laptop KR211822",
//       color: "black",
//       producer: "Dell",
//       price: "$499.99",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//     {
//       id: 3,
//       img: "http://images.samsung.com/is/image/samsung/uk-led-tv-hg40ed670ck-hg40ed670ckxxu-001-front",
//       title: "Samsung TV 4K SmartTV",
//       color: "gray",
//       producer: "Samsung",
//       price: "$999.49",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//     {
//       id: 4,
//       img: "https://raylo.imgix.net/iphone-14-blue.png",
//       title: "Apple Iphone 14 Pro Max",
//       color: "white",
//       producer: "Apple",
//       price: "$799.49",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//     {
//       id: 5,
//       img: "https://www.signify.com/b-dam/signify/en-aa/about/news/2020/20200903-movie-night-essentials-popcorn-ice-cream-and-the-new-philips-hue-play-gradient-lightstrip/packaging-lighstrip.png",
//       title: "Philips Hue Play Gradient",
//       color: "rainbow",
//       producer: "Philips",
//       price: "$39.99",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 6,
//       img: "https://www.smartworld.it/wp-content/uploads/2019/09/High_Resolution_PNG-MX-Master-3-LEFT-GRAPHITE.png",
//       title: "Logitech MX Master 3",
//       color: "black",
//       producer: "Logitech",
//       price: "$59.49",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//     {
//       id: 7,
//       img: "https://www.pngarts.com/files/7/Podcast-Mic-PNG-Picture.png",
//       title: "Rode Podcast Microphone",
//       color: "gray",
//       producer: "Rode",
//       price: "$119.49",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 8,
//       img: "https://5.imimg.com/data5/SW/VM/MY-5774620/toshiba-split-ac-2-ton-3-star-rated-ras-24s3ks-500x500.png",
//       title: "Toshiba Split AC 2",
//       color: "white",
//       producer: "Toshiba",
//       price: "$899.99",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//     {
//       id: 9,
//       img: "https://img.productz.com/review_image/102489/preview_sony-kdl-50w800b-50-inch-hdtv-review-superb-picture-102489.png",
//       title: "Sony Bravia KDL-47W805A",
//       color: "black",
//       producer: "Sony",
//       price: "$970.49",
//       createdAt: "01.02.2023",
//     },
//     {
//       id: 10,
//       img: "https://venturebeat.com/wp-content/uploads/2015/07/As_AO1-131_gray_nonglare_win10_03.png?fit=1338%2C1055&strip=all",
//       title: "Acer Laptop 16 KL-4804",
//       color: "black",
//       producer: "Acer",
//       price: "$599.99",
//       createdAt: "01.02.2023",
//       inStock: true,
//     },
//   ];

export const singleUser = {
  id: 1,
  title: "John Doe",
  img: "https://images.pexels.com/photos/17397364/pexels-photo-17397364.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
  info: {
    username: "Johndoe99",
    fullname: "John Doe",
    email: "johndoe@gmail.com",
    phone: "123 456 789",
    status: "verified",
  },
  chart: {
    dataKeys: [
      { name: "visits", color: "#82ca9d" },
      { name: "clicks", color: "#8884d8" },
    ],
    data: [
      {
        name: "Sun",
        visits: 4000,
        clicks: 2400,
      },
      {
        name: "Mon",
        visits: 3000,
        clicks: 1398,
      },
      {
        name: "Tue",
        visits: 2000,
        clicks: 3800,
      },
      {
        name: "Wed",
        visits: 2780,
        clicks: 3908,
      },
      {
        name: "Thu",
        visits: 1890,
        clicks: 4800,
      },
      {
        name: "Fri",
        visits: 2390,
        clicks: 3800,
      },
      {
        name: "Sat",
        visits: 3490,
        clicks: 4300,
      },
    ],
  },
  activities: [
    {
      text: "John Doe purchased Playstation 5 Digital Edition",
      time: "3 day ago",
    },
    {
      text: "John Doe added 3 items into their wishlist",
      time: "1 week ago",
    },
    {
      text: "John Doe purchased Sony Bravia KD-32w800",
      time: "2 weeks ago",
    },
    {
      text: "John Doe reviewed a product",
      time: "1 month ago",
    },
    {
      text: "John Doe added 1 items into their wishlist",
      time: "1 month ago",
    },
    {
      text: "John Doe reviewed a product",
      time: "2 months ago",
    },
  ],
};
export const singleProduct = {
  id: 1,
  title: "Playstation 5 Digital Edition",
  img: "https://store.sony.com.au/on/demandware.static/-/Sites-sony-master-catalog/default/dw1b537bbb/images/PLAYSTATION5W/PLAYSTATION5W.png",
  info: {
    productId: "Ps5SDF1156d",
    color: "white",
    price: "$250.99",
    producer: "Sony",
    export: "Japan",
  },
  chart: {
    dataKeys: [
      { name: "visits", color: "#82ca9d" },
      { name: "orders", color: "#8884d8" },
    ],
    data: [
      {
        name: "Sun",
        visits: 4000,
        orders: 2400,
      },
      {
        name: "Mon",
        visits: 3000,
        orders: 1398,
      },
      {
        name: "Tue",
        visits: 2000,
        orders: 3800,
      },
      {
        name: "Wed",
        visits: 2780,
        orders: 3908,
      },
      {
        name: "Thu",
        visits: 1890,
        orders: 4800,
      },
      {
        name: "Fri",
        visits: 2390,
        orders: 3800,
      },
      {
        name: "Sat",
        visits: 3490,
        orders: 4300,
      },
    ],
  },
  activities: [
    {
      text: "John Doe purchased Playstation 5 Digital Edition",
      time: "3 day ago",
    },
    {
      text: "Jane Doe added Playstation 5 Digital Edition into their wishlist",
      time: "1 week ago",
    },
    {
      text: "Mike Doe purchased Playstation 5 Digital Edition",
      time: "2 weeks ago",
    },
    {
      text: "Anna Doe reviewed the product",
      time: "1 month ago",
    },
    {
      text: "Michael Doe added Playstation 5 Digital Edition into their wishlist",
      time: "1 month ago",
    },
    {
      text: "Helen Doe reviewed the product",
      time: "2 months ago",
    },
  ],
};
export const sampleData: TransactionData = {
  netChanges: {
    RizwanKabir: -11,
    Bonna: 11,
  },
  givers: ["Bonna"],
  receivers: ["RizwanKabir"],
  paymentInstructionsOptimized: [
    { from: "Bonna", to: "RizwanKabir", amount: 11 },
  ],
  balances: {
    RizwanKabir: 11,
    Bonna: -11,
  },
  totalExpenseByUser: {
    RizwanKabir: 48.97,
  },
  transactions: [{ from: "Bonna", to: "RizwanKabir", amount: 11 }],
};

export const months = [
"January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];