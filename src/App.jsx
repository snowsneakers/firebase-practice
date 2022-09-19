import {useState, useEffect} from "react"
import {db} from "./firebase-config"
import { collection, getDocs, doc, deleteDoc, addDoc } from "firebase/firestore"
function App() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const usersCollectionRef = collection(db, "users")

  const getUsers = async () => {
    setLoading(true)
    const data = await getDocs(usersCollectionRef)
    setUsers(data.docs.map(doc => ({...doc.data(), id: doc.id})))
    setLoading(false)
  }

  useEffect(() => {
    getUsers()
  }, [])

  console.log(users)

  const deleteUser = async (id) => {
    const user = doc(db, "users", id)
    await deleteDoc(user)
    window.location.reload()
  }

  const addUser = async (e) => {
    e.preventDefault()
    await addDoc(usersCollectionRef, {name: userName})
    setUserName("")
    window.location.reload()
  }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Users</h1>
      <form className="mb-5" onSubmit={addUser}>
        <input type="text" placeholder="add user" onChange={(e) => setUserName(e.target.value)} className="bg-slate-200  py-1 px-2" />
        <button className="py-1 px-2 bg-slate-400 text-white font-medium">+</button>
      </form>
     <ul>
      {loading ? <div className="basic"></div> : users.map(user => {
        return (
          <li key={user.id}>
            <div className="w-96 border-b border-black/50  p-2 flex items-center justify-between">
                <div>
                  <h2 className="capitalize">{user.name}</h2>
                </div>
                <button className="py-1 px-2 bg-slate-400 rounded-md text-white font-medium" onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          </li>
        )
      })}
     </ul>
    </div>
  );
}

export default App;
