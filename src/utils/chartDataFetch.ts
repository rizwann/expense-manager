import axios from "axios"
import { CategoryData, House } from "../types"
import { StoreData } from "../components/PieChartBox"
import { Tdata } from "../components/ChartBox"
const API_URL = `${import.meta.env.VITE_API_URL}/api/chart`
export type lastSixMonthsResponse = {
  last6Months: object[],
  percentage: number,
}
export type lastSixMonthsCatResponse = {
  finalResult: object[],
  last6Months: object[],
  response: object[],
  catComparison: CategoryData[]
}


export const fetchUserContribution = async (house: House, token: string, month: number, year: number) => {
    try {
      const URI = `${API_URL}/house/expenses/contributions/${house.code}/${month}/${year}`
      const response = await axios.get<object[]>(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching expenses:", error)
      return []
    }
  }


export const fetchUserSixMonthsExpenses = async (house: House, token: string, month: number, year: number) => {
    try {
      const URI = `${API_URL}/user/expenses/half-yearly/${house.code}/${month}/${year}`
      const response = await axios.get<lastSixMonthsResponse>(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data?.last6Months
    } catch (error) {
      console.error("Error fetching expenses:", error)
      return []
    }
  }


 export const fetchHouseExpByAllStore = async (house: House, token: string) => {
    try {
        const URI = `${API_URL}/stores/${house.code}?currentMonth=true`
        const response = await axios.get<StoreData[]>(URI, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          return response.data
        } catch (error) {
          console.error("Error fetching expenses:", error)
          return []
        }
      }



      export const fetchUserWeekly = async (house: House, token: string) => {
        try {
          const URI = `${API_URL}/user/expenses/weekly/${house.code}`
          const response = await axios.get<object[]>(URI, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          return response.data
        } catch (error) {
          console.error("Error fetching expenses:", error)
          return []
        }
      }


    export const fetchUserMonthlyComparison = async (house: House, token: string, month: number, year: number) => {
      try {
        const URI = `${API_URL}/user/expenses/comparison/${house.code}/${month}/${year}`
        const response = await axios.get<Tdata>(URI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        return response.data
      } catch (error) {
        console.error("Error fetching expenses:", error)
        return {
          totalExpensesThisMonth: 0,
      totalExpensesLastMonth:0,
      percentage:0
        }
    }
  }

  export const fetchHouseLastSixMonthsExpenses = async (house: House, token: string, month: number, year: number) => {
    try {
      const URI = `${API_URL}/house/expenses/half-yearly/${house.code}/${month}/${year}`
      const response = await axios.get<lastSixMonthsResponse>(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
  }
  catch (error) {
    console.error("Error fetching expenses:", error)
    return []
  }
  }

  export const fetchPopularStoreExpenses = async (house: House, token: string, month: number, year: number) => {
    try {
      const URI = `${API_URL}/expenses/store/${house.code}/${month}/${year}`
      const response = await axios.get<object>(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching expenses:", error)
      return []
  }
  }

export const fetchPopularCategoryExpenses = async (house: House, token: string, month: number, year: number) => {
    try {
      const URI = `${API_URL}/expenses/category/${house.code}/${month}/${year}`
      const response = await axios.get<object>(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error("Error fetching expenses:", error)
      return []
}
  }

export const fetchSixMonthsExpensesByCategory = async (house: House, token: string, month: number, year: number ) => {
    try {
      const URI = `${API_URL}/expenses/category/half-yearly/${house.code}/${month}/${year}`
      const response = await axios.get<lastSixMonthsCatResponse>(URI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.catComparison
    } catch (error) {
      console.error("Error fetching expenses:", error)
      return []
  }
}
