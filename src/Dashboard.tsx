import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "./firebase"
import Loarder from "./components/Loader"

type docType = {
    originalUrl: string,
    newUrl: string,
    uid?: string,
    click?: number
}

const Dashboard = () => {
    const { uid } = useParams()
    const [result, setResult] = useState<docType[]>([])

    const getUserData = async () => {
        const q = query(collection(db, "urls"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        let arr: any = []
        querySnapshot.forEach((doc) => {
            //@ts-ignore
            arr.push(doc.data())
        });
        console.log(arr)
        setResult([...arr])
    }
    useEffect(() => {
        getUserData()
    }, [uid])
    return (
        <div className="min-h-[80vh] bg-[#263849] text-white">
            <h2 className="text-3xl text-center p-10 font-semibold">Dashboard</h2>

            {result.length > 0 ?
                <div className="border max-w-[700px] mx-auto">
                    <div className="flex gap-x-10 justify-center p-2 border-b font-bold">
                        <span className="w-[100px]">S.No.</span>
                        <span className="w-[300px] overflow-x-auto text-sm">Original URL</span>
                        <span className="w-[350px] overflow-x-auto text-sm">New Url</span>
                        <span className="w-[100px] overflow-x-auto text-sm">Click</span>
                    </div>
                    {
                        result.map((item, index) => <div className="flex gap-x-10 justify-center p-2 border-b border-gray-400" key={item?.originalUrl}>
                            <span className="w-[100px] text-sm">{index + 1}</span>
                            <span className="w-[300px] overflow-x-auto cursor-pointer text-sm"><a href={item?.originalUrl} target="_blank">{item?.originalUrl}</a></span>
                            <span className="w-[350px] overflow-x-auto cursor-pointer text-sm" ><a target="_blank" href={item?.newUrl}>{item?.newUrl}</a></span>
                            <span className="w-[100px] text-sm">{item?.click}</span>
                        </div>)
                    }
                </div> :
                <div className="flex mt-10 justify-center ">
                    <Loarder />
                </div>
            }
        </div>
    )
}

export default Dashboard
