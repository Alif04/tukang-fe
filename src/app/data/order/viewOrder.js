import axios from 'axios'

const fetchOrderList = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL

    const response = await axios.get(`${apiUrl}/orders`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
      },
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const ViewOrder = async () => {
  try {
    const apiData = await fetchOrderList()
    if (!apiData) {
      console.error('No data received from fetchOrderList')
      return []
    }

    console.log(apiData)

    const orderData = apiData.map((item) => {
      let data

      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      }

      const orderDate = new Date(item.created_at)

      let orderStatus =
        item.project_status_id === 1
          ? 'ON PROGRESS'
          : // : item.project_status_id === 2
            // ? 'ON PROGRESS'
            // : item.project_status_id === 3
            // ? 'DONE'
            ''

      let phoneNumber =
        item.members.phone_number !== 'null'
          ? item.members.phone_number
          : item.members.whatsapp_number

      data = {
        order_id: item.id,
        assign_from: item.store.store_name,
        date_order: formatDate(orderDate),
        no_member: item.members.id,
        costumer_name: item.members.full_name,
        phone_number: phoneNumber,
        installer_name: item.tukang.full_name,
        // payment_status: item.
        order_status: orderStatus,
      }

      return data
    })

    return orderData
  } catch (error) {
    console.error('Error getting order list data:', error)
    return []
  }
}

export default ViewOrder
