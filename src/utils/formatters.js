
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
})

export const formatDate = (timestamp) =>
    dateFormatter.format(new Date(timestamp))

export const formatDatetime = (timestamp) => dateTimeFormatter.format(new Date(timestamp))