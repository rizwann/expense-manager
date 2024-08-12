
const expenseFields = [
    {
        field: "storeName",
        headerName: "Store name",
        control: 'select',
      },
      {
        field: "category",
        headerName: "Category",
        control: 'select',
      },
      {
        field: "house",
        headerName: "House",
        control: 'select',
      },
      {
        field: "description",
        headerName: "Description",
        control: 'text',
      },
      {
        field:"involvedUsers",
        headerName: "Involved Users",
        control: 'select',
      },
      {
        field: "cost",
        headerName: "Cost",
        control: 'text',
      },
      //  convert date to local date
      {
        field: "date",
        headerName: "Date",
        control: 'date',
      },
]

const storeFields = [
    {
        field: "name",
        headerName: "Store Name",
        control: 'text',
      },
      {
        field: "image",
        headerName: "Store Image",
        control: 'file',
      },
]

export const config = {
    expenseFields,
    storeFields
}