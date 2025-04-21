const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const base64Placeholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAACXBIWXMAAAsTAAALEwEAmpwYAAASuUlEQVR4nO3d55Lj1tWGUd//HcjKkq0sWbKtnLOsaOXIa9lf7anqr2iK5xB8CbJ7etaPVaoadTM0CDzAOQD4l81mUwCwOdJfrvsFALC5KwkIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISA3xI8//lj//e9//+SHH35Y5fF//vnn+vTTT+utt96q1157rV599dV644036qOPPqrvvvvurO/t+++/v/M8/Xz9vP38/Tr69fz000/X/re/rb799tu9n6lffvlllcfvz81oufbn7Vzv648//qivv/663n///Xr99dfrlVdeufPfd999t7744ov67bffrv1vv7lHCMgN0JF46KGH6r777vuTF1988aTH/uSTT+qZZ57Z+9jbHnvssTsr/6+//rrKe+qV+J133qnHH3/84HM/9dRTdzZEvWG47mVxW/RyH/29+299ynJ9++2373xeDi3Xp59+uj7++OPVlmuvJx2L0bpy5f7777+z3nRkrns5bG45AblmvXL1BnS0MqQB6b3DJ5988uBKvqtXzlM2MO2zzz6rRx555Ojn/tvf/nZnD/m6l8ndro/4HnjggdUD0lF6+OGHj16uf//7309arr2O9FHOX//616Ofu9eftY642PyJgFyzPuw/tAIc+5j/+c9/phuQJV5++eVoz7FX9FOetzcSvdd63cvlbvX777/XE088Mf0bJwHpIaJTlmsfFXSAkiOeZ5999qTnfvTRR88+TLu5RwnINeo99SV7UMc8Zo8BJ3tq+/z73/++aDy2I5JsbNjcCf+hv++xATk1HtvLtedHjonhkuHXpUfWa80nsvl/AnKNk+aHxnKPDUg/5oMPPrhoZeohpiWh6YnKtWLYz9fPu+R99x6r4az15j3SgCx5zGOWax8ZLz0a6B2YJZ+TPsJYcsTdQ6Qm2DerEpAbOO+RBmR2qN8rWh8hdGSufr5Xph4umk2I9op5aM+tx5hnG4/euHz44Yf/s/L22Vc9GTtb8Xvs3MT6Mr2Mluw8HBOQPpPq0HLtx9pdrn0yxmy59hDboeX6+eefH5yg75/Zfpze4fjnP/85/b0+W+y6l9XmFhGQGzjvkQSk5z1mEfjmm2+Gv9tnXs2GCg69htn76Y3FbBKz90ZnE7MffPDBtS+v2zDvkQSkz3gaPUafoHFouc7i0zsUo9/tKPTOw+h3+8hkFqDeKRodXfe/G8rarEZALmw01HM1rJQGpPfIRivcknHn3hj0UMBopesze0a/N9rb7D3iJSvrV199NVzh++jIUUg27zHaCC8JSB999FHr6LO6fSQ78uWXXw6Xa5/ePVqus+HQ/pwv+TzM5uOOndtjMyQgN2Teo1eafUNJSwLSh+6jlaWPLJa+vt7bP/bQvy/eGv3Om2++ufi5+32OHqePrs6xPPpv3vE65TE6kNc54T+ao+jPWW/A04D08OJoefT/W/r6/vGPfwwfp4eg9v3Oc889N/ydpdd29FHZ6FTy3uFZ63qnzT1OQG7AvEcPFfTP7BvDXhKQ2Vkyx2x8+zWOVrr+9317fqP31CvpMeff91XTo/fw0ksvnSUevXfcrzONSMejj9r6cU69dmbteY9+f72xTQMyGhI7duM727np+Yp9Rz6jo5ZjdoZaX8g6eu7rWF6bW0hALmQ0T9DDDL231BvnfSvOkoD02SX7Hrs3LscO/8xOA93d++sJ09HPPv/880f/jdZ8H0visb1RPDYiV/G4eox+vEvO18zmPa52SEYT0Yc2nn2kPFquL7zwwtGvdXSSRh8l7S7Xfm2j537vvfeOXkajx+ojo0stq80tJiAXMJrg3j6lsc9k2fczhwLSe/lrruyzyfjdoYvZKZ7Hruyth8lGjzc7CeAYHcF9oT4mIrvx2HapiyBHE9xXOySzuYRDAZltxJNIzibjd0/Vnp1FlUx+j3ZKOl6XWE6bW05ArnHeY/saizQgsw1+H8If+3qPCdLs7KvkGo6e7F8zSPv0Hm+/j1HQD0VkFo/eWF3i5pCjcO9eYzH6ex4KyOwotIca13q9+4I02uD3mXrJ32p2LYmzsTYnE5Az6o3V6Oyo3SGeNCCzcd7eA01e9yh4febM0snO5IKt2TxIb9TWXC6ziPTk82hnYDQc03+bS8RjNu+xe9FnGpDRKd195HZ1dHOM2TzI9skZo2Hc1utR8vearR/nOjljcw8RkDMa7aH3hPTuBHMakNneYnr/n1H0euVesrfY7y953t44jTYgHas1l82xRyK94R7F41JHHrN5j33DlWlARu+z/z153aPP9u7rns1Z/Otf/4qee3ZK8FpHtZt7mICcyWhoqTeQ+/Zw04D0GUqjFSS9bcPslNrtxxydsdVnZqV/t9FFhac85qkRuQnxmM0l7NshOSUgoyPQ9Chg6WPOjlT6uo7keWePecxp5mz2EpALz3uMVoQ0ID0UNlpB0jOXZuPG2xvL0QWEx55uuW22oT7HsjoUkdmtXi4Zj1EMRjskpwTkHEeBo52NPqK6+pnRdSvHXnuyrY/CR4/ZIwSXWHabW0xALjjv0bd/GG3U04CMxqt745e+h9lZM1fDYv0+1jyF91zDYqdGZOSS8Uh2SNKALB1uOtboi8W2h8XOMdw0OyXZFembkwnIheY9eoM+uh3IKQEZjYmfcpri7MLEq2tBZmdrnfItiqMvwToliGtH5JLxmF2AOtshSQMyu7bnlAs6l3xO1z59+JyfUzZ3CMiKZncQPXR9gIBcb0CWRuSS8ZgdDS65z5iACMjmzARkJb3ijYYZ9t2y4dxDWH0jvPS93GtDWNv6KHH2PSnHfCHSqWZDOksuWLxJQ1ij5XruIaxZEA1hbU4mIGee9+gVZMm9g0yiX88k+tLrPJZcJ7L2azllh6SZRDeJvjkzAVnBaMinV8Slt+BwGu/lT+PdNjtVd19ETr2L70yHfzSU15PRS5fr3XAa7/bOhtN4N3cdAVlh3mO0x9Y3bOvvKF9idN1Ir2C7P7s99n2bLiTsDeOlLiRcGo/Rd2KcMyKze4L1nvjSz1RvIEd73rs/u32UPPpb9C1c0uU6ej8uJNzc1QTkREu+t3lt/ZWh57yVyegoYHcYaTZ8dpNvZbJ02Krfb///U+6dlRjda+uctu9dNvpqZLcyYbNDQE40+xKmSwTEzRTPF4/+boo1bsB4rNmXMF0iILOTKNxMkc0WATnRbO/qEgFZ+3bus0P+23A796Xx2D1VN70BY2L2bYCXCMglb+e+GyS3c9/cVQTkRL1hGU0QnsvukcXou697w3bOL5TqPfS78Qullh557FvWlzgSGX2T4Dltb8h9oRSbhQRkBb332ZPdfUriKUYr2fbP9GRyr+Dbz99nqIxWFF9pu048Lh2R/q75/tue8nma3VV3++d6mGd32a71lbZ95DharvtOR+7PjK+03dw1BOSGSE/jPbTxPWalm83nbE927m7o1jhNcnbq8JqTnaPnWRKPJRHZvq7huqWn8R4aRjvmmozZfE6fwbjvd2bfM7N7FDzSk/2jnaFjI8hmSEBuQUBmp94uvXq69/xGZ//0HuHoPl79e6MLCpfcbuPqCG6019l7y2sOX/WGY/eoqYcAl8ZjFpFL3+bknAHp5To6hbmPinePgo9drrtfTrZ0Hq4/50s+D7Ojclegb1YjILckILOzsXoDP5uE7o3q6JYoS17D7Gys3iOfDWX1tSqj04ZPuQfS0ogk8dgXkZsWj1MDcmjye8lync0Nzl5D/11H83pXAZhFpG/zMvrdDpqzrzarEZBbEpBDh/694vRe2faeYz/n7PsuruJzaIXrDclsY9FDCR9++OH/DBv0xraHQkZHL1cbqTWPPnb/3r0hSuNxpV9fB/TUx7mJAVmyXPuxtq/56eXaZwmeulxnNya9OhLpn9l+nD6TbHYWV3P7ks2qBOQWBWR2/6Rt/TO98s9uGjj6nu1k2GF3o7PkNfbwSXLNAesF5NCp2ts7J0uXa4dl6R0SZmcEbj93D73OgnWljxLT2/uw2UtAblFAWt+WYkkYljj26u/RrTOO1a+/N1zXvUzudmsE5NB8wrHL9Zi7GfdE+Gxo9Rg9TGroarM6AbllAWl9aL9kj2ymx7+T4aNTNza9kVlyq3IuF5BD3xGzRB9RJjsFvV6Mbq2yVB+hpPeFYzMlILcwIK1XmNE1GjM9DHHqOfI9nDU6hXKmJ06TW6Bw/oBcPd7shIfZnMcpy7V3ZProNjmy7vXnmOuR2BxFQG5pQK70Xl8PAxxa+XoivSc/1zo/vt9PX8g1urp8W4euN2rnmjC/V60dkKvl2ic/jL7jfPtIsie6+2hyreXaQ1B9ZHxorqWPdnq9WXrNCJuYgNwgvYLsWuvsnt4L6yODXvn7TJS+MLCHm3pjcu7D+76GpDck/Xz9vP38/Tp6A3cTz166LXpjv+8ztdZEcn9u+vOzu1z7c3bOvf4OUsehT/HuobV+7v5v3+qk5wBNlG8uRkAAqISAAFAJAQGgEgICQCUEBIBKCAgAlRAQACohIABUQkAAqISAAFAJAQGgEgICQCUEBIBKCAgAlRAQACohIABUQkAAqISAAFAJAQGgEgICQCUEBIBKCAgAlRAQACohIABUQkAAqISAAFAJAQGgEgICQCUEBIBKCAgAlRAQACohIABUQkAAqISAAFAJAQGgEgICQCUEBIBKCAgAlRAQACohIABUQkAAqISAAFAJAQGgEgICQCUEBIBKCAgAEQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBoBICAkAlBASASggIAJUQEAAqISAAVEJAAKiEgABQCQEBICIgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJQQEgEoICACVEBAAKiEgAFRCQACohIAAUAkBAaASAgJAJf4PShINtTKQgbIAAAAASUVORK5CYII=";

const mockDentists = [
  {
    id: 1,
    name: "Иван",
    surname: "Иванов",
    patronymic: "Иванович",
    email: "ivan@example.com",
    role: "specialist",
    avatar: base64Placeholder,
  },
  {
    id: 2,
    name: "Петр",
    surname: "Петров",
    patronymic: "Петрович",
    email: "petr@example.com",
    role: "specialist",
    avatar: base64Placeholder,
  },
];

const mockClients = [
  {
    id: 10,
    name: "Джон",
    surname: "Доу",
    patronymic: null,
    email: "john@example.com",
    phone: "+79998887766",
    gender: "Муж",
    birthday: "1990-01-01",
    role: "patient",
    avatar: base64Placeholder,
  },
];

const mockRecords = [
  {
    id: 1,
    dentist: mockDentists[0],
    patient: mockClients[0],
    status: "scheduled",
    appointment_date: new Date().toISOString(),
    duration: 30,
    notes: "Первичный приём",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    actual_date: null,
  },
];

const mockApiService = {
  getDentists: async () => {
    await delay(300);
    return { data: mockDentists };
  },

  createDentist: async (data) => {
    await delay(300);
    const newDentist = { ...data, id: Date.now() };
    mockDentists.push(newDentist);
    return { data: newDentist };
  },

  getDentistById: async (id) => {
    await delay(300);
    return { data: mockDentists.find((d) => d.id === id) };
  },

  updateDentistById: async (id, data) => {
    await delay(300);
    const index = mockDentists.findIndex((d) => d.id === id);
    mockDentists[index] = { ...mockDentists[index], ...data };
    return { data: mockDentists[index] };
  },

  deleteDentistById: async (id) => {
    await delay(300);
    const index = mockDentists.findIndex((d) => d.id === id);
    if (index !== -1) mockDentists.splice(index, 1);
    return { data: null };
  },

  getCurrentDentist: async () => {
    await delay(300);
    return { data: mockDentists[0] };
  },

  getCurrentClient: async () => {
    await delay(300);
    return { data: mockClients[0] };
  },

  getRecords: async () => {
    await delay(300);
    return { data: mockRecords };
  },

  getRecordById: async (id) => {
    await delay(300);
    return { data: mockRecords.find((r) => r.id === id) };
  },

  createRecord: async (data) => {
    await delay(300);
    const newRecord = {
      ...data,
      id: Date.now(),
      dentist: mockDentists[0],
      patient: mockClients[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockRecords.push(newRecord);
    return { data: newRecord };
  },
};

export default mockApiService;
