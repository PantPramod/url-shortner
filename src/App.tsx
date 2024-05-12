import { FormEvent, useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Loader from "./components/Loader";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link } from "react-router-dom";

const App = () => {
  const [text, setText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCopyMessage, setShowCopyMessage] = useState(false)
  const [result, setResult] = useState({
    originalUrl: '',
    newUrl: ''
  })
  const [user, setUser] = useState<any>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null)

  const [showLoader, setShowLoader] = useState(false)
  async function getNewId() {
    let id = generateRandomWord()
    const docRef = doc(db, "urls", id);
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      getNewId()
    } else {
      return id
    }
  }

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()
    try {
      setShowLoader(true)

      let myquery

      if (user) {
        myquery = query(collection(db, "urls"), where("originalUrl", "==", text), where("uid", "==", user?.uid));

      } else {
        myquery = query(collection(db, "urls"), where("originalUrl", "==", text));
      }


      const querySnapshot = await getDocs(myquery);

      let arr: { originalUrl: string, newUrl: string }[] = []
      querySnapshot.forEach((doc) => {
        //@ts-ignore
        arr.push(doc.data())

      });

      if (arr.length > 0) {
        setResult({ newUrl: arr[0].newUrl, originalUrl: arr[0].originalUrl })
        setShowLoader(false)
        setShowModal(true)
        return;
      }






      let id = await getNewId()

      await setDoc(doc(db, "urls", id!), {
        originalUrl: text,
        newUrl: `${window.location.href}${id}`,
        ...(user && { uid: user?.uid }),
        click: 0
      });

      setResult({ newUrl: `${window.location.href}${id}`, originalUrl: text })
      setShowLoader(false)
      setShowModal(true)
    } catch (err) {
      setShowLoader(false)
      setShowModal(false)
    }
  }

  const copyHandler = (str: string) => {
    navigator.clipboard.writeText(str);
    setShowCopyMessage(true)

    setTimeout(() => { setShowCopyMessage(false) }, 2000)


  }

  const signInHandler = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result: any) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;

        setUser({ ...user })
        console.log(user, token)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch(() => {
        
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  console.log("User=>", user)
  return (
    <>

      <div className="min-h-screen ">
        <div className="bg-[#263849] min-h-[80vh] pb-10">

          <div className=" p-4 relative">
            {user && <p className="absolute left-1/2 -translate-x-1/2 text-white"><Link to={`/dashboard/${user.uid}`}>Dashboard</Link></p>}
            {
              user ? <div className="flex gap-x-4 justify-end text-white" >
                <span className="mr-2">{user?.displayName}</span>
                <p className="flex items-center justify-center    w-8 h-8 rounded-full bg-blue-600 text-white overflow-hidden">

                  <img src={user?.photoURL} alt={user?.displayName[0]} />
                </p>
                <button
                  onClick={() => setUser(null)}
                  className="bg-gray-700 text-sm text-white rounded-md px-4 py-2">Logout</button>
              </div>
                :
                <button className="border text-white bg-blue-500 px-4 py-2 rounded-md ml-auto block  " onClick={signInHandler}>Signin with Google</button>
            }
          </div>
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center pt-20 font-semibold">Free URL Shortner</h1>
          <p className="text-gray-400 text-xs px-2 md:max-w-[575px] lg:max-w-[unset] md:mx-auto sm:text-sm md:text-[16px] mt-5 text-center ">url shortner is a free tool to shorten URLs . Create short , memorable and easy links in seconds.</p>
          <form className="flex sm:w-[70%] md:w-[70%] lg:w-[55%] mx-auto mt-5 gap-x-1 sm:gap-x-5 px-3" onSubmit={submitHandler}>
            <input
              type="url"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-400 p-2 rounded-md flex-1 outline-none"
              placeholder="Enter Link here"
              required
            />
            <button
              className="bg-[#2281C2] text-[16px] md:text-xl text-white p-2 rounded-md font-semibold text-xl px-4 lg:w-[200px]"
              type="submit">Create</button>
          </form>
        </div>
        {
          showLoader &&
          <div className="flex min-h-screen bg-transparent items-center justify-center fixed top-0 left-0 right-0 bottom-0">
            <Loader />
          </div>

        }





      </div>
      {
        showModal &&
        <div className="bg-[#312f2f8f] fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center ">
          <div className="relative bg-white w-[90%] sm:w-[400px]  min-h-[200px] rounded-3xl  ">
            <div className="  w-full rounded-t-3xl bg-[#263849de]">
              <p
                onClick={() => setShowModal(false)}
                className="text-xl cursor-pointer  text-white text-right pr-5 py-1 ">x</p>
            </div>

            <div className="flex relative mt-14 justify-center">
              <div className="bg-white p-2 rounded-l-md border-r-0  border-gray-400 border ">{result?.newUrl}</div>
              <button
                onClick={() => copyHandler(result?.newUrl)}
                className="bg-[#2281C2] px-4 border border-[#2281C2] text-white p-2 rounded-r-md">Copy</button>
              {showCopyMessage &&
                <div className=" text-sm p-1 absolute bg-green-500 text-white bottom-[120%] left-[50%] -translate-x-1/2">Copied</div>}
            </div>

          </div>
        </div>
      }
    </>
  )
}

export default App


function generateRandomWord() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomWord = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomWord += characters[randomIndex];
  }
  return randomWord;
}