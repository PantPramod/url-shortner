import {  doc, getDoc, updateDoc} from "firebase/firestore";
import { useEffect } from "react"
import { db } from "./firebase";
import { useParams } from "react-router-dom";
import RedirectSpinner from "./components/RedirectSpinner";


const RedirectScreen = () => {
    const { id } = useParams()
    async function getRedirectPath() {
        const docRef = doc(db, "urls", id!);
        const docSnap = await getDoc(docRef);
        
        await updateDoc(doc(db, "urls", docSnap.id), {
            click: docSnap?.data()!.click +1
          });
        if (docSnap.exists()) {
            console.log(docSnap.data());

            let anchor = document.createElement('a')
            anchor.setAttribute('href', docSnap?.data()?.originalUrl)
            document.body.appendChild(anchor)
            window.location.assign(docSnap?.data()?.originalUrl)
            anchor.click();
            document.body.removeChild(anchor)
        } else {
            return;
        }
    }
    useEffect(() => {
        getRedirectPath()
    }, [])
    return (
        <div className="flex items-center justify-center text-xl min-h-[80vh] bg-[#263849] text-white">
            <RedirectSpinner />
        </div>
    )
}

export default RedirectScreen
