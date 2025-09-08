type Props = {
  clientName: string;
  product: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  requestedDueDate?: string;
};

export default function Email(props: Props) {
  const {
    clientName,
    product,
    propertyAddress,
    propertyCity,
    propertyState,
    propertyZip,
    requestedDueDate,
  } = props;

  return (
    <div>
      <p>Client: {clientName}</p>
      <p>Service: {product}</p>
      <p>
        Address: {propertyAddress} {propertyCity}, {propertyState}{" "}
        {propertyZip}
      </p>
      <p>Due date: {requestedDueDate}</p>
    </div>
  );
}
