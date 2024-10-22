const today = new Date();

const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const year = today.getFullYear();

const formattedDate = `${day}/${month}/${year}`;

console.log(formattedDate);
export const data = {
    widgets: {
        performance_document: {
            title: 'Current Total AUM',
            description1: '',
            description2: `As at ${formattedDate}`,
            amount: 'USD 38,000,000.00',
        },
        account_detail: {
            title: 'Total Subscription',
            description1: '',
            description2: '',
            amount: 'USD 40,000,000',
        },
        transactions: {
            title: 'Total Redemption',
            description1: '',
            description2: '',
            amount: 'USD 10,000,000',
        },

    },
    nav_history: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: '2024',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: [245, 230, 340, 262, 177, 103, 128, 266, 248, 256, 270, 382],
            }
        ]
    },
    performance_history:
    {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: '2024',
                data: [45, 23, 60, 30, 17, 80],
            }
        ]
    },
    latest_activity:[
        {
          description: '13/06/2024 12:00PM',
          startIcon: 'arrow-right-circle',
          startIconColor: '#35a000',
          title: 'New Performance Document Received',
          icon: 'eye',
        },
        {
          description: '12/06/2024 5:31PM',
          startIcon: 'arrow-right-circle',
          startIconColor: '#f85146',
          title: 'Update The National ID Card',
          icon: 'refresh-cw'
        },
        {
          description: "12/06/2024 7:31PM",
          startIcon: 'arrow-right-circle',
          startIconColor: '#35a000',
          title: 'You Recent Transaction Has Been Approved',
          icon: 'check-circle'
        },
        {
          description: "12/06/2024 8:31PM",
          startIcon: 'arrow-right-circle',
          startIconColor: '#35a000',
          title: 'Your Payment Method Has Been Updated',
          icon: 'credit-card'
        },
        {
          description: "11/06/2024 12:00PM",
          startIcon: 'arrow-right-circle',
          startIconColor: '#2c8ffb',
          title: 'Your Profile Picture Has Been Changed',
          icon: 'user'
        },
      ]
}