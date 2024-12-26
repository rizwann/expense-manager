const timeZones = [
  { value: "Pacific/Midway", label: "Midway Island (GMT-11:00)" },
  { value: "Pacific/Honolulu", label: "Hawaii (GMT-10:00)" },
  { value: "America/Anchorage", label: "Alaska (GMT-09:00)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada) (GMT-08:00)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada) (GMT-07:00)" },
  { value: "America/Chicago", label: "Central Time (US & Canada) (GMT-06:00)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada) (GMT-05:00)" },
  { value: "America/Miami", label: "Miami (GMT-05:00)" },
  { value: "America/Halifax", label: "Atlantic Time (Canada) (GMT-04:00)" },
  { value: "America/Sao_Paulo", label: "Brasilia (GMT-03:00)" },
  { value: "Atlantic/South_Georgia", label: "South Georgia (GMT-02:00)" },
  { value: "Atlantic/Azores", label: "Azores (GMT-01:00)" },
  { value: "Europe/London", label: "London (GMT+00:00)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+01:00)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (GMT+02:00)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+04:00)" },
  { value: "Asia/Kolkata", label: "India Standard Time (GMT+05:30)" },
  { value: "Asia/Dhaka", label: "Dhaka (GMT+06:00)" },
  { value: "Asia/Bangkok", label: "Bangkok (GMT+07:00)" },
  { value: "Asia/Shanghai", label: "China Standard Time (GMT+08:00)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+09:00)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+10:00)" },
  { value: "Pacific/Auckland", label: "Auckland (GMT+13:00)" },
]
const currencies =  [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "GBP", label: "GBP", symbol: "£" },
  { value: "BDT", label: "BDT", symbol: "৳" },
  { value: "AUD", label: "AUD", symbol: "A$" },
  { value: "CAD", label: "CAD", symbol: "C$" },
  { value: "CNY", label: "CNY", symbol: "¥" },
  { value: "INR", label: "INR", symbol: "₹" },
  { value: "JPY", label: "JPY", symbol: "¥" },
]

const expenseFields = [
  {
    field: "storeName",
    headerName: "Store name",
    control: "select",
  },
  {
    field: "category",
    headerName: "Category",
    control: "select",
  },
  {
    field: "house",
    headerName: "House",
    control: "select",
  },
  {
    field: "description",
    headerName: "Description",
    control: "text",
  },
  {
    field: "cost",
    headerName: "Cost",
    control: "text",
    type: "number",
  },
  {
    field: "involvedUsers",
    headerName: "Involved Users",
    control: "select",
  },
  //  convert date to local date
  {
    field: "date",
    headerName: "Date",
    control: "date",
  },
  {
    field: "receipt",
    headerName: "Receipt",
    control: "file",
  },
]

const storeFields = [
  {
    field: "name",
    headerName: "Store Name",
    control: "text",
  },
  {
    field: "image",
    headerName: "Store Image",
    control: "file",
  },
]

const houseFields = [
  {
    field: "description",
    headerName: "House Name",
    control: "text",
  },
  {
    field: "code",
    headerName: "House Code",
    control: "text",
  },
  {
    field: "image",
    headerName: "House Image",
    control: "file",
  },
  {
    field: "timeZone",
    headerName: "Time Zone",
    control: "select",
    options: timeZones,
  },
  {
    field: "currency",
    headerName: "Currency",
    control: "select",
    options: currencies
  }
]
const userFields = [
  {
    field: "name",
    headerName: "Name",
    control: "text",
  },
  {
    field: "username",
    headerName: "Username",
    control: "text",
  },
  {
    field: "email",
    headerName: "Email",
    control: "text",
  },
  {
    field: "gender",
    headerName: "Gender",
    control: "select",
  },

  {
    field: "password",
    headerName: "Password",
    control: "password",
  },
  {
    field: "confirmPassword",
    headerName: "Confirm Password",
    control: "password",
  },
  {
    field: "image",
    headerName: "Image",
    control: "file",
  }

]



  
  

export const config = {
  expenseFields,
  storeFields,
  houseFields,
  userFields,
  currencies
}
