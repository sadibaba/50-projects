
---

## 📱 COMPLETE OTP ECOSYSTEM (6 APIs)

### 1. Send OTP (Register/Login ke liye)
```js
const sendOTP = async (phoneNumber, purpose = "login") => {
  try {
    const res = await fetch("https://api.myshop.com/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        phone: phoneNumber, 
        purpose: purpose  // "login", "register", "reset-password"
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }
    
    return {
      success: true,
      message: "OTP sent successfully",
      expiresIn: data.expiresIn, // 60 seconds
      attemptsLeft: data.attemptsLeft
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};
```

---

### 2. Verify OTP
```js
const verifyOTP = async (phoneNumber, otp, purpose = "login") => {
  try {
    const res = await fetch("https://api.myshop.com/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phoneNumber,
        otp: otp,
        purpose: purpose
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      if (res.status === 400) throw new Error("Invalid OTP");
      if (res.status === 410) throw new Error("OTP expired, request new one");
      if (res.status === 429) throw new Error("Too many attempts, try later");
      throw new Error(data.message || "Verification failed");
    }
    
    // Agar login/register ke liye tha toh token bhejega
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    
    return {
      success: true,
      message: "OTP verified successfully",
      token: data.token || null,
      user: data.user || null,
      isNewUser: data.isNewUser || false
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};
```

---

### 3. Resend OTP
```js
const resendOTP = async (phoneNumber, purpose = "login") => {
  try {
    const res = await fetch("https://api.myshop.com/otp/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phoneNumber,
        purpose: purpose
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      if (res.status === 429) throw new Error("Please wait 30 seconds before resend");
      throw new Error(data.message || "Failed to resend OTP");
    }
    
    return {
      success: true,
      message: "OTP resent successfully",
      expiresIn: data.expiresIn,
      attemptsLeft: data.attemptsLeft
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};
```

---

### 4. Complete Registration After OTP
```js
const completeRegistration = async (phone, otp, userDetails) => {
  try {
    // Pehle OTP verify karo
    const verifyRes = await verifyOTP(phone, otp, "register");
    
    if (!verifyRes.success) {
      throw new Error("OTP verification failed");
    }
    
    // Phir register karo
    const res = await fetch("https://api.myshop.com/auth/register/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${verifyRes.token}`
      },
      body: JSON.stringify({
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Registration failed");
    
    localStorage.setItem("token", data.token);
    
    return {
      success: true,
      message: "Registration completed",
      user: data.user,
      token: data.token
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};
```

---

### 5. Password Reset via OTP (Full Flow)
```js
const resetPasswordWithOTP = async (phone, otp, newPassword) => {
  try {
    // Pehle OTP verify
    const verifyRes = await verifyOTP(phone, otp, "reset-password");
    
    if (!verifyRes.success) {
      throw new Error("Invalid OTP");
    }
    
    // Phir password reset
    const res = await fetch("https://api.myshop.com/auth/reset-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${verifyRes.token}`
      },
      body: JSON.stringify({
        password: newPassword,
        confirmPassword: newPassword
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Password reset failed");
    
    return {
      success: true,
      message: "Password reset successfully, please login"
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};
```

---

### 6. Phone Number Change with OTP (Double Verification)
```js
const changePhoneNumber = async (oldPhone, oldOTP, newPhone, newOTP) => {
  try {
    // Old number verify
    const oldVerify = await verifyOTP(oldPhone, oldOTP, "change-phone");
    if (!oldVerify.success) throw new Error("Old phone OTP invalid");
    
    // New number verify
    const newVerify = await verifyOTP(newPhone, newOTP, "change-phone");
    if (!newVerify.success) throw new Error("New phone OTP invalid");
    
    // Update phone number
    const token = localStorage.getItem("token");
    const res = await fetch("https://api.myshop.com/user/change-phone", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        oldPhone,
        newPhone
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || "Phone change failed");
    
    return {
      success: true,
      message: "Phone number updated successfully",
      newPhone: data.phone
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message 
    };
  }
};
```

---

## 🎮 BONUS: OTP Helper Utilities

### OTP Timer (Frontend)
```js
const startOTPTimer = (duration = 60) => {
  let timeLeft = duration;
  const timerElement = document.getElementById("otpTimer");
  
  const timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timerElement.textContent = "Resend OTP";
      timerElement.style.color = "blue";
      return;
    }
    
    timeLeft--;
    timerElement.textContent = `Resend in ${timeLeft}s`;
    timerElement.style.color = "gray";
  }, 1000);
  
  return timer;
};
```

### OTP Input Handler (6 Digits Auto-Focus)
```js
const setupOTPInputs = () => {
  const inputs = document.querySelectorAll(".otp-input");
  
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
    
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
  
  // Get complete OTP
  return () => {
    return Array.from(inputs).map(input => input.value).join("");
  };
};
```

---

## 📊 COMPLETE OTP FLOW SUMMARY

| API | Method | Purpose | Token Needed |
|-----|--------|---------|--------------|
| sendOTP | POST | OTP bhejo | No |
| verifyOTP | POST | OTP verify karo | No (Returns token) |
| resendOTP | POST | Dobara OTP | No |
| completeRegistration | POST | Register after OTP | Temporary token |
| resetPasswordWithOTP | PUT | Password reset | Temporary token |
| changePhoneNumber | PUT | Phone change (2 OTPs) | Yes |

---

## 🎯 PRACTICE KARO AB

1. **Har API 5-5 baar likho** — notebook mein
2. **Error cases yaad rakho**:
   - Wrong OTP → 400
   - Expired OTP → 410
   - Too many attempts → 429
3. **Token flow samjho** — Kab token chahiye, kab nahi

**OTP system complete! Ab kal Default Parameters ka din hai!** 🔥💪