import { useParams } from "react-router-dom";
import AcceptUser from "../../components/AcceptUser";

const AcceptUserPage
 = () => {
    const { id, houseCode, ownId } = useParams();
  return (
    <AcceptUser id={id} houseCode={houseCode} ownId ={ownId} />
  )
}

export default AcceptUserPage
