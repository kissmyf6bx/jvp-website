import {
  useState,
  useEffect
} from "react";

import jsPDF from "jspdf";

function DonationForm() {

// PDF RECEIPT
const generateReceipt = () => {

  const doc =
    new jsPDF();

  // PAGE BACKGROUND
  doc.setFillColor(
    15,
    23,
    42
  );

  doc.rect(
    0,
    0,
    210,
    297,
    "F"
  );

  // WHITE CARD
  doc.setFillColor(
    255,
    255,
    255
  );

  doc.roundedRect(
    15,
    15,
    180,
    250,
    8,
    8,
    "F"
  );

  // LOGO
  try {

    doc.addImage(
      "/jvp-logo.png",
      "PNG",
      20,
      20,
      28,
      28
    );

  } catch (err) {

    console.log(err);

  }

  // TITLE
  doc.setTextColor(
    15,
    23,
    42
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(24);

  doc.text(
    "Donation Receipt",
    58,
    32
  );

  // USER PROFILE
    if (user) {

    try {

        doc.addImage(
        user.photoURL,
        "JPEG",
        145,
        20,
        28,
        28
        );

    } catch (err) {

        console.log(err);

    }

    doc.setFontSize(11);

    doc.setTextColor(
        71,
        85,
        105
    );

    doc.text(
        user.displayName,
        145,
        55
    );

    doc.text(
        user.email,
        145,
        62
    );

    }

  // SUBTITLE
  doc.setFontSize(12);

  doc.setTextColor(
    100,
    116,
    139
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Velankanni Parish",
    58,
    40
  );

  // DIVIDER
  doc.setDrawColor(
    226,
    232,
    240
  );

  doc.setLineWidth(0.5);

  doc.line(
    20,
    55,
    185,
    55
  );

  // SECTION TITLE
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(14);

  doc.setTextColor(
    30,
    41,
    59
  );

  doc.text(
    "Donation Details",
    20,
    72
  );

  // DETAILS
  const rows = [

    [
      "Full Name",
      form.name
    ],

    [
      "Phone Number",
      form.phone
    ],

    [
      "Ward",
      form.outsider
        ? "Outsider"
        : form.ward
    ],

    [
      "Amount Paid",
      `₹${form.amount}`
    ],

    [
      "UPI Transaction ID",
      form.upiTransactionId
    ],

    [
      "Date & Time",
      new Date()
        .toLocaleString()
    ],

  ];

  let y = 90;

  rows.forEach((row) => {

    // LABEL
    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.setTextColor(
      51,
      65,
      85
    );

    doc.text(
      row[0],
      25,
      y
    );

    // VALUE BOX
    doc.setFillColor(
      248,
      250,
      252
    );

    doc.roundedRect(
      70,
      y - 7,
      105,
      12,
      3,
      3,
      "F"
    );

    // VALUE
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      15,
      23,
      42
    );

    doc.text(
      String(row[1]),
      75,
      y
    );

    y += 22;

  });

  // THANK YOU BOX
  doc.setFillColor(
    239,
    246,
    255
  );

  doc.roundedRect(
    20,
    215,
    155,
    28,
    5,
    5,
    "F"
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setTextColor(
    30,
    64,
    175
  );

  doc.setFontSize(13);

  doc.text(
    "Thank you for supporting",
    28,
    228
  );

  doc.text(
    "VELANKANNI PARISH",
    28,
    236
  );

  // RECEIPT ID
  doc.setFontSize(10);

  doc.setTextColor(
    148,
    163,
    184
  );

  doc.text(
    `Receipt generated on ${new Date().toLocaleDateString()}`,
    20,
    255
  );

  // SAVE
  doc.save(
    `receipt-${form.name}.pdf`
  );

};

  // STEP
  const [step, setStep] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "donationStep"
        );

      return saved === "2"
        ? 2
        : 1;

    });

    const [user] =
        useState(null);

  // FORM
  const [form, setForm] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "donationForm"
        );

      return saved
        ? JSON.parse(saved)
        : {

            name: "",

            phone: "",

            ward: "",

            outsider: false,

            amount: "",

            upiTransactionId: "",

          };

    });

  // WARDS
  const wards = [

    "1. St. Bridget's Ward",

    "2. St. Joseph's Ward",

    "3. St. Ursula's Ward",

    "4. Don Bosco Ward",

    "5. Queen Mary Ward",

    "6. St. Vincent Pallotti Ward",

    "7. St. Antony's Ward",

    "8. St. Sebastian's Ward",

    "9. Mother Petra Ward",

  ];

  // SAVE FORM
  useEffect(() => {

    localStorage.setItem(
      "donationForm",
      JSON.stringify(form)
    );

  }, [form]);

  // SAVE STEP
  useEffect(() => {

    localStorage.setItem(
      "donationStep",
      step
    );

  }, [step]);

  // INPUT CHANGE
  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setForm({

      ...form,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    });

  };

  // NEXT STEP
  const handleNext = () => {

    if (
      !form.name ||
      !form.phone ||
      (!form.outsider &&
        !form.ward) ||
      !form.amount
    ) {

      alert(
        "Please fill all details"
      );

      return;

    }

    setStep(2);

  };

  // SUBMIT
  const handleSubmit =
    async () => {

    if (
      !form.upiTransactionId
    ) {

      alert(
        "Please enter UPI Transaction ID"
      );

      return;

    }

    try {

      const response =
        await fetch(
          "https://formspree.io/f/mdabdadz",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Accept:
                "application/json",

            },

            body: JSON.stringify({

              name:
                form.name,

              phone:
                form.phone,

              ward:
                form.outsider
                  ? "Outsider"
                  : form.ward,

              amount:
                form.amount,

              upiTransactionId:
                form.upiTransactionId,

              submittedAt:
                new Date()
                  .toLocaleString(),

            }),

          }
        );

      if (response.ok) {

        setStep(3);

      } else {

        alert(
          "Failed to submit donation"
        );

      }

    } catch (err) {

      console.error(err);

      alert(
        "Something went wrong"
      );

    }

  };

  return (
    <>

      {/* STEP 1 */}
      {step === 1 && (

        <div className="space-y-5">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
          />

          {/* PHONE */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
          />

          {/* OUTSIDER */}
          <label
            className="
              flex
              items-center
              gap-3
              text-sm
              text-gray-300
            "
          >

            <input
              type="checkbox"
              name="outsider"
              checked={form.outsider}
              onChange={handleChange}
            />

            I am not from
            Velankanni Parish

          </label>

          {/* WARD */}
          <select
            name="ward"
            value={form.ward}
            onChange={handleChange}
            disabled={form.outsider}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
              disabled:opacity-50
            "
          >

            <option value="">
              Select Ward
            </option>

            {wards.map((ward) => (

              <option
                key={ward}
                value={ward}
              >
                {ward}
              </option>

            ))}

          </select>

          {/* AMOUNT */}
          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            value={form.amount}
            onChange={handleChange}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
          />

          {/* BUTTON */}
          <button
            onClick={handleNext}
            className="
              w-full
              bg-white
              text-black
              py-4
              rounded-2xl
              font-medium
            "
          >
            Make a Donation
          </button>

        </div>

      )}

      {/* STEP 2 */}
      {step === 2 && (

        <div className="space-y-6">

          {/* QR */}
          <div
            className="
              bg-white
              rounded-[2rem]
              p-5
              flex
              justify-center
            "
          >

            <img
              src="/donate-qr.png"
              alt="QR Code"
              className="
                w-full
                max-w-[260px]
                rounded-2xl
              "
            />

          </div>

          {/* DOWNLOAD QR */}
          <div className="flex justify-center">

            <a
              href="/donate-qr.png"
              download
              className="
                inline-flex
                items-center
                gap-2
                bg-white/10
                border
                border-white/10
                px-4
                py-2
                rounded-full
                text-sm
              "
            >
              ⋯ Download QR Code
            </a>

          </div>

          {/* TRANSACTION ID */}
          <input
            type="text"
            name="upiTransactionId"
            placeholder="Enter UPI Transaction ID"
            value={
              form.upiTransactionId
            }
            onChange={handleChange}
            className="
              w-full
              bg-white/5
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
          />

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="
              w-full
              bg-white
              text-black
              py-4
              rounded-2xl
              font-medium
            "
          >
            Submit Donation
          </button>

        </div>

      )}

      {/* STEP 3 */}
      {step === 3 && (

        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            textAlign:
              "center",
            paddingTop:
              "60px",
          }}
        >

          {/* ICON */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius:
                "999px",
              background:
                "rgba(34,197,94,0.2)",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              fontSize: "48px",
              marginBottom:
                "32px",
            }}
          >
            ✓
          </div>

          {/* TITLE */}
          <h2
            style={{
              fontSize:
                "38px",
              fontWeight:
                "600",
              marginBottom:
                "20px",
            }}
          >
            Donation Submitted
          </h2>

          {/* TEXT */}
          <p
            style={{
              color:
                "#9ca3af",
              marginBottom:
                "40px",
            }}
          >
            Thank you for your
            support and generosity.
          </p>

          {/* DOWNLOAD PDF */}
          <button
            onClick={
              generateReceipt
            }
            style={{
              width: "100%",
              background:
                "white",
              color:
                "black",
              padding:
                "16px",
              borderRadius:
                "18px",
              border:
                "none",
              fontWeight:
                "600",
              marginBottom:
                "16px",
              cursor:
                "pointer",
            }}
          >
            Download PDF Receipt
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={() => {

              setForm({

                name: "",

                phone: "",

                ward: "",

                outsider: false,

                amount: "",

                upiTransactionId:
                  "",

              });

              setStep(1);

              localStorage.removeItem(
                "donationForm"
              );

              localStorage.removeItem(
                "donationStep"
              );

              window.location.href =
                "/#donate";

            }}
            style={{
              width: "100%",
              background:
                "rgba(255,255,255,0.1)",
              color:
                "white",
              padding:
                "16px",
              borderRadius:
                "18px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              fontWeight:
                "600",
              cursor:
                "pointer",
            }}
          >
            Back to Website
          </button>

        </div>

      )}

    </>
  );
}

export default DonationForm;