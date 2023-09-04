
export const EVENTS= [
    {
        start: '2023-07-18 12:00:00',
        end: '2023-07-08 14:00:00',
        title: 'New Year Celebration Party', summary: 'Hotel Radision',
    },{
        start: '2023-07-20 08:00:00',
        end: '2023-07-20 10:00:00',
        title: 'New Year Wishes', summary: 'Call & Text Everyone',
    },
    {
        start: '2023-07-13 12:30:00',
        end: '2023-07-13 14:30:00',
        title: 'Rahul Birthday Party', summary: 'Call him',
    }
]

export const LINK= [
    {
        id: 1,
        label: 'youtube',
        icon: 'https://assets10.lottiefiles.com/private_files/lf30_cwyafad8.json',
        lien: 'https://www.youtube.com',
    },
    {
        id: 2,
        label: 'facebook',
        icon: 'https://assets1.lottiefiles.com/private_files/lf30_pb3we3yk.json',
        lien: 'https://www.facebook.com',
    },
    {
        id: 3,
        label: 'instagram',
        icon: 'https://assets7.lottiefiles.com/private_files/lf30_f5ytlpiy.json',
        lien: 'https://www.instagram.com',
    },
    {
        id: 4,
        label: 'website',
        icon: 'https://assets1.lottiefiles.com/packages/lf20_rLfMZE.json',
        lien: 'https://www.school.com'
    }
]


export const startingConversations= [
    {
        id: "101",
        title: "Nic Cage",
        messages: [
            {
                text: "Hey how are you?",
                time: new Date().toISOString(),
                userID: 1,
                id: "1",
            },
            {
                text: "Really good thanks! How about you?",
                time: new Date().toISOString(),
                userID: 2,
                id: "2",
            }
        ],
        users: [1, 2],
    },
    {
        id: "102",
        title: "Nic",
        messages: [
            {
                text: "Test",
                time: new Date().toISOString(),
                userID: 1,
                id: "1",
            },
            {
                text: "Test2",
                time: new Date().toISOString(),
                userID: 2,
                id: "2",
            }
        ],
        users: [1, 2],
    },
    // generate more conversations here
    {
        id: "103",
        title: "Mr Cage",
        messages: [
            {
                text: "Hey how are you?",
                time: new Date().toISOString(),
                userID: 1,
                id: "1",
            },
            {
                text: "Really good thanks! How about you?",
                time: new Date().toISOString(),
                userID: 2,
                id: "2",
            }
        ],
        users: [1, 2],
    },
    {
        id: "104",
        title: "Nic's birthday",
        messages: [
            {
                text: "Hey how are you?",
                time: new Date().toISOString(),
                userID: 1,
                id: "1",
            },
            {
                text: "Really good thanks! How about you?",
                time: new Date().toISOString(),
                userID: 2,
                id: "2",
            }
        ],
        users: [1, 2],
    }
];