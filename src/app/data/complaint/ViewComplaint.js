import axios from 'axios'

const fetchComplaintList = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL

    const response = await axios.get(`${apiUrl}/complaints?status=1`, {
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

const ViewComplaint = async () => {
  try {
    const apiData = await fetchComplaintList()

    if (!apiData) {
      console.error('No data received from fetchOrderList')
      return []
    }

    console.log(apiData)

    const complaintData = apiData.map((item) => {
      let data

      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      }

      const complaintDate = new Date(item.complaint_date)

      let complaintStatus =
        item.complaint_status === 1
          ? 'ON PROGRESS'
          : // : item.project_status_id === 2
            // ? 'ON PROGRESS'
            // : item.project_status_id === 3
            // ? 'DONE'
            ''

      let orderStatus =
        item.project_status_id === 1
          ? 'ON PROGRESS'
          : // : item.project_status_id === 2
            // ? 'ON PROGRESS'
            // : item.project_status_id === 3
            // ? 'DONE'
            ''

      // let phoneNumber =
      //   item.members.phone_number !== 'null'
      //     ? item.members.phone_number
      //     : item.members.whatsapp_number

      data = {
        complaint_id: item.id,
        // assign_from: item.store.store_name,
        // order_id: item.order_id,
        // date_order: formatDate(orderDate),
        // no_member: item.members.id,
        // costumer_name: item.members.full_name,
        // phone_number: phoneNumber,
        // installer_name: item.tukang.full_name,
        // order_status: orderStatus,
        // work_status: item,
        complaint_date: formatDate(complaintDate),
        complaint_desc: item.description,
        complaint_status: complaintStatus,
      }

      return data
    })

    return complaintData
  } catch (error) {
    console.error('Error getting order list data:', error)
    return []
  }
}

export default ViewComplaint
