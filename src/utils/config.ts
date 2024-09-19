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
  userFields
}
