import React from "react"

const MyTable = ({ data }) => {
  return (
    // Add Bootstrap classes to the table element
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Status</th>
          <th>Added By</th>
          <th>Comment</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.status}</td>
            <td>{item.addedBy}</td>
            <td>{item.comment}</td>
            <td>{item.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default MyTable
