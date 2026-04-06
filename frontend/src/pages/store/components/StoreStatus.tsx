interface Status {
  status?: "open" | "closed";
  onToggle: () => void;
}

export const StoreStatus = ({ status, onToggle }: Status) => (
  <section>
    <div className="mb-2 border-b-2 border-dashed w-full  border-blue pb-4">
      <h2 className="text-blue text-5xl font-instrument">Are we open?</h2>
    </div>
    <div className="w-full  flex justify-center items-center">
      <div className="w-full">
        <p
          className={`text-3xl p-6 px-21 mt-4 text-center  uppercase w-full  duration-700 transition-all font-bold ${status === "open" ? "bg-blue text-white" : "scale-95  bg-blue/25 text-white"}`}
        >
          {status}
        </p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className="bg-blue border-4 border-blue text-white transition-all font-semibold py-2 px-4  mt-4 w-full  cursor-pointer "
    >
      {status === "open" ? "Let's call it a Day" : "Open your Store"}
    </button>
  </section>
);
