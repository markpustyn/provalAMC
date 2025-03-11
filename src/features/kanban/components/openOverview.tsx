import { OpenOrder } from "types";

const OpenOverview = ({
  id,
  PropAddress,
  PropCity,
  PropOwner,
  PropState,
  PropZip,
  Services,
  UserID,
  PONumber,
  dbaName,
  PropDesc,
  AccContact,
  AccMobile,
  AccHome,
  AccWork,
  AccEmail,
  CallbackReference,
  Notes,
  ReportHTML,
  Status,
  isDone,
}: OpenOrder) => {
  return (
    <section>
      <div>
        <h1>{PropAddress}</h1>
        <div>
          <p>{PropCity}</p>
          <p>{PropState}</p>
          <p>{PropZip}</p>
        </div>
      </div>
    </section>
  );
};

export default OpenOverview;
