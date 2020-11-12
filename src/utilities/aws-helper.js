export const getUserData = async (username) => {
  const response = await fetch(`https://wb1jsep2hj.execute-api.us-east-1.amazonaws.com/Prod/system/getUserData/${username}`)
  
  const userData = await response.json()
  return userData[0];
}

export const getGroups = async (groupID) => {
  const response = await fetch(`https://wb1jsep2hj.execute-api.us-east-1.amazonaws.com/Prod/admin/getCourseGroups?courseCode=${groupID}`)
  return await response.json();
}