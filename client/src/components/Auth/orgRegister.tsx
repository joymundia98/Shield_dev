import "./LoginForm.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import headerLogo from "../../assets/headerlogo.png";
import { useNavigate } from "react-router-dom";

// ---------------------------
// Validation Schema
// ---------------------------
const orgSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  organization_email: z
    .string()
    .email("Invalid email")
    .min(1, "Email is required"),
  mainDenomination: z.string().min(1, "Main denomination is required"),
  subDenomination: z.string().min(1, "Sub-denomination is required"),
  customSubDenomination: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
  status: z.string().optional(),
  customDistrict: z.string().optional()
});

type OrgFormData = z.infer<typeof orgSchema>;

// ---------------------------
// Provinces & Districts
// ---------------------------
const provinceDistrictMap: Record<string, string[]> = {
  "Central Province": ["Chibombo", "Chisamba", "Chitambo", "Kabwe", "Kapiri Mposhi", "Luano", "Mkushi", "Mumbwa", "Ngabwe", "Serenje", "Shibuyunji", "Not Listed"],
  "Copperbelt Province": ["Chililabombwe", "Chingola", "Kalulushi", "Kitwe", "Luanshya", "Lufwanyama", "Masaiti", "Mpongwe", "Mufulira", "Ndola", "Not Listed"],
  "Eastern Province": ["Chadiza", "Chipata", "Katete", "Lundazi", "Mambwe", "Nyimba", "Petauke", "Sinda", "Vubwi", "Not Listed"],
  "Luapula Province": ["Chiengi", "Chembe", "Chipili", "Kawambwa", "Lunga", "Mansa", "Milenge", "Mwansabombwe", "Mwense", "Nchelenge", "Samfya", "Not Listed"],
  "Lusaka Province": ["Lusaka", "Chongwe", "Kafue", "Luangwa", "Chilanga", "Rufunsa", "Not Listed"],
  "Muchinga Province": ["Chama", "Chinsali", "Isoka", "Mafinga", "Mpika", "Nakonde", "Shiwang'andu", "Lavushimanda", "Kanchibiya", "Not Listed"],
  "Northern Province": ["Chilubi", "Kaputa", "Kasama", "Lunte", "Lupososhi", "Luwingu", "Mbala", "Mporokoso", "Mpulungu", "Mungwi", "Nsama", "Senga", "Not Listed"],
  "North-Western Province": ["Chavuma", "Ikelenge", "Kabompo", "Kasempa", "Kalumbila", "Manyinga", "Mufumbwe", "Mushindamo", "Mwinilunga", "Solwezi", "Zambezi", "Not Listed"],
  "Southern Province": ["Chikankata", "Chirundu", "Choma", "Gwembe", "Itezhi-Tezhi", "Kalomo", "Kazungula", "Livingstone", "Mazabuka", "Monze", "Namwala", "Pemba", "Siavonga", "Sinazongwe", "Zimba", "Not Listed"],
  "Western Province": ["Kalabo", "Kaoma", "Limulunga", "Luampa", "Lukulu", "Mitete", "Mongu", "Mulobezi", "Mwandi", "Nalolo", "Nkeyema", "Senanga", "Sesheke", "Shang'ombo", "Sikongo", "Sioma", "Not Listed"]
};

// ---------------------------
// Denominations
// ---------------------------
const denominations: Record<string, string[]> = {
  Catholicism: ["Roman Catholic", "Eastern Catholic"],
  Orthodoxy: ["Eastern Orthodox", "Oriental Orthodox"],
  Protestantism: ["Anglican", "Lutheran", "Presbyterian", "Methodist", "Baptist", "Reformed", "Pentecostal", "Non-denominational", "Charismatic", "Not Listed"],
  Evangelical: ["Pentecostal", "Non-denominational", "Charismatic", "Not Listed"],
  Adventist: ["Seventh-day Adventist", "Mormon", "Jehovah's Witnesses", "Not Listed"],
  Anabaptist: ["Mennonite", "Amish", "Hutterites", "Not Listed"],
  Other: ["Quakers", "Salvation Army", "Christian Science", "Unitarian", "Not Listed"]
};

const OrgRegister = () => {
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [showCustomDistrict, setShowCustomDistrict] = useState(false);
  const [subDenoms, setSubDenoms] = useState<string[]>([]);
  const [showCustomSub, setShowCustomSub] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema)
  });

  // Watchers
  const watchedDistrict = watch("district");
  const watchedMainDenom = watch("mainDenomination");
  const watchedSubDenom = watch("subDenomination");

  useEffect(() => {
    setShowCustomDistrict(watchedDistrict === "Not Listed");
  }, [watchedDistrict]);

  useEffect(() => {
    if (watchedMainDenom) {
      setSubDenoms(denominations[watchedMainDenom] || []);
      setValue("subDenomination", ""); // reset subDenomination when main changes
    }
  }, [watchedMainDenom, setValue]);

  useEffect(() => {
    setShowCustomSub(watchedSubDenom === "Not Listed");
  }, [watchedSubDenom]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setDistricts(provinceDistrictMap[province] || []);
  };

  const onSubmit = async (data: OrgFormData) => {
    try {
      const districtToSend = data.district === "Not Listed" ? data.customDistrict : data.district;
      const subToSend = data.subDenomination === "Not Listed" ? data.customSubDenomination : data.subDenomination;
      const fullDenomination = `${data.mainDenomination}-${subToSend}`;

      // Debugging: Log form data before sending it to the backend
      console.log("Form data before sending to backend:", {
        name: data.name,
        email: data.organization_email,
        denomination: fullDenomination,
        address: data.address,
        region: data.region,
        district: districtToSend,
        status: data.status || "active"
      });

      await axios.post(
        "http://localhost:3000/api/organizations/register",
        {
          name: data.name,
          email: data.organization_email,
          denomination: fullDenomination,
          address: data.address,
          region: data.region,
          district: districtToSend,
          status: data.status || "active"
        },
        {
          headers: {
            'Content-Type': 'application/json'  // Ensure you're sending JSON data
          }
        }
      );

      setShowSuccessCard(true);
      setTimeout(() => {
        setShowSuccessCard(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Error in onSubmit:", err);
      setErrorMessage(err.response?.data?.message || "Organization registration failed");
    }
  };

  return (
    <div className="login-parent-container">
      <div className="loginContainer">
        <div className="header">
          <img src={headerLogo} alt="Logo" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Organization Name */}
          <div className="field input-field">
            <input type="text" {...register("name")} />
            <label>Organization Name</label>
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          {/* Organization Email */}
          <div className="field input-field">
            <input type="email" {...register("organization_email")} />
            <label>Organization Email</label>
            {errors.organization_email && <p className="form-error">{errors.organization_email.message}</p>}
          </div>

          {/* Main Denomination Dropdown */}
          <div className="field input-field select-field">
            <select {...register("mainDenomination")} defaultValue="">
              <option value="" disabled>Select Main Denomination</option>
              {Object.keys(denominations).map((main) => (
                <option key={main} value={main}>{main}</option>
              ))}
            </select>
            {errors.mainDenomination && <p className="form-error">{errors.mainDenomination.message}</p>}
          </div>

          {/* Sub Denomination Dropdown */}
          {subDenoms.length > 0 && (
            <div className="field input-field select-field">
              <select {...register("subDenomination")} defaultValue="">
                <option value="" disabled>Select Sub Denomination</option>
                {subDenoms.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              {errors.subDenomination && <p className="form-error">{errors.subDenomination.message}</p>}
            </div>
          )}

          {/* Custom Sub Denomination Input */}
          {showCustomSub && (
            <div className="field input-field">
              <input type="text" {...register("customSubDenomination")} />
              <label>Enter Your Sub-Denomination</label>
            </div>
          )}

          {/* Address */}
          <div className="field input-field">
            <input type="text" {...register("address")} />
            <label>Address</label>
            {errors.address && <p className="form-error">{errors.address.message}</p>}
          </div>

          {/* Region (Province) Dropdown */}
          <div className="field input-field select-field">
            <select {...register("region")} onChange={handleProvinceChange} defaultValue="">
              <option value="" disabled>Select Province</option>
              {Object.keys(provinceDistrictMap).map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {errors.region && <p className="form-error">{errors.region.message}</p>}
          </div>

          {/* District Dropdown */}
          {selectedProvince && (
            <div className="field input-field select-field">
              <select {...register("district")} defaultValue="">
                <option value="" disabled>Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <p className="form-error">{errors.district.message}</p>}
            </div>
          )}

          {/* Custom District Input */}
          {showCustomDistrict && (
            <div className="field input-field">
              <input type="text" {...register("customDistrict")} />
              <label>Enter Your District</label>
            </div>
          )}

          {/* Status Dropdown */}
          <div className="field input-field select-field">
            <select {...register("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <p className="form-error">{errors.status.message}</p>}
          </div>

          {errorMessage && <p className="form-error">{errorMessage}</p>}

          <div className="field button-field">
            <button type="submit">Register Organization</button>
          </div>

          <div className="form-link sign-up">
            <span>Already Registered &nbsp;</span>
            <a href="/org-login">Login</a>
          </div>
        </form>
      </div>

      {showSuccessCard && (
        <div className="success-card">
          <h3>✅ Organization Created!</h3>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default OrgRegister;
