import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FormControl } from "react-bootstrap";

const DEFAULT_RESULT = {
  film: "",
  ticketAmount: 0,
  date: "",
  searchResult: [], // Menambahkan searchResult ke DEFAULT_RESULT
};

const DEFAULT_HTM = {
  type1: 35000,
  type2: 50000,
  type3: 60000,
};

function App() {
  const [result, setResult] = useState(DEFAULT_RESULT);
  const [savedResult, setSavedResult] = useState([{}]);
  const [htm, setHtm] = useState(DEFAULT_HTM);

  const handleSave = () => {
    const newSavedResult = {
      film: result.film,
      ticketAmount: result.ticketAmount,
      date: result.date,
      day: result.day,
    };

    // Mendapatkan indeks hari (0 untuk Minggu, 1 untuk Senin, dst.)
    const dayIndex = new Date(result.date).getDay();

    // Menentukan harga tiket berdasarkan hari yang dipilih
    let ticketPrice = 0;
    if (dayIndex >= 1 && dayIndex <= 4) {
      ticketPrice = htm.type1 * result.ticketAmount; // Senin - Kamis
    } else if (dayIndex === 5 || dayIndex === 6) {
      ticketPrice = htm.type2 * result.ticketAmount; // Jumat - Sabtu
    } else {
      ticketPrice = htm.type3 * result.ticketAmount; // Minggu
    }

    newSavedResult.ticketPrice = ticketPrice; // Menambahkan harga tiket ke objek yang disimpan
    setSavedResult([...savedResult, newSavedResult]);
    console.log("Saved Results: ", savedResult);
  };

  const handleFilmSelect = (e) => {
    const selectedFilm = result.searchResult.find(
      (film) => film.Title === e.target.value
    );
    setResult({ ...result, film: selectedFilm.Title });
  };

  const handleFilmSearch = (e) => {
    const searchQuery = e.target.value;
    setResult({ ...result, film: searchQuery });
  };


  const totalTicketSold = savedResult.reduce((total, result) => {
    return total + (result.ticketAmount || 0);
  }, 0);

  const totalDailyIncome = savedResult.reduce((totalIncome, result) => {
    return totalIncome + (result.ticketPrice || 0);
  }, 0);

  useEffect(() => {
    const fetchFilmData = async (searchQuery) => {
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?s=${searchQuery}&apikey=d592fe1a`
        );
        const data = await response.json();
        if (data.Search) {
          setResult({ ...result, searchResult: data.Search });
        } else {
          setResult({ ...result, searchResult: [] }); // Pastikan searchResult diatur ke array kosong
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Pemanggilan fetchFilmData hanya jika ada kata kunci pencarian
    if (result.film !== "") {
      fetchFilmData(result.film);
    }
  }, [result.film]);

  // console.log('here', result)

  return (
    <div
      className="d-grid"
      style={{ backgroundImage: "url(/Bg.jpg)"}}
    >
      <div className="d-flex row-cols-2 gap-5 p-5 m-5">
        <div className="">
          <Card>
            <Card.Body className="shadow-lg">
              <h1 className="">Ticket Reservations</h1>
              <p className="">(Booking movie tickets)</p>
              <hr />
              <Form>
                <div className="d-flex gap-5 mt-3">
                  <Form.Group className="w-50" controlId="formGroupSearchFilm">
                    <Form.Label className="flex">Search Film</Form.Label>
                    <FormControl
                      type="search"
                      placeholder="Type Keyword.."
                      defaultValue={result.film}
                      onChange={handleFilmSearch}
                    />
                    <Form.Select
                      aria-label="Default select example"
                      className="mt-1"
                      onChange={handleFilmSelect}
                    >
                      <option>Choose a film</option>
                      {result.searchResult.map((film, index) => (
                        <option key={index} value={film.Title}>
                          {film.Title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="formGroupAmount">
                    <Form.Label className="flex">Tickets Amount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Amount of tickets"
                      min="0"
                      value={result.ticketAmount || 0}
                      onChange={(e) =>
                        setResult({
                          ...result,
                          ticketAmount: e.target.valueAsNumber,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formGroupDate">
                    <Form.Label className="flex">Date</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder=""
                      value={result.date}
                      onChange={(e) =>
                        setResult({ ...result, date: e.target.value })
                      }
                    />
                  </Form.Group>
                </div>
                <div className="d-flex justify-content-end mb-4">
                  <Button variant="success" onClick={handleSave}>
                    Save
                  </Button>
                </div>

                <h5>HTM :</h5>
                <div className="d-flex gap-5">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label className="mr-10">Senin - Kamis</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder=""
                      defaultValue={htm.type1}
                      onChange={(e) =>
                        setHtm({
                          ...htm,
                          type1: e.target.valueAsNumber,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label>Jumat - Sabtu</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder=""
                      defaultValue={htm.type2}
                      onChange={(e) =>
                        setHtm({
                          ...htm,
                          type2: e.target.valueAsNumber,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput3">
                    <Form.Label>Minggu</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder=""
                      defaultValue={htm.type3}
                      onChange={(e) =>
                        setHtm({
                          ...htm,
                          type3: e.target.valueAsNumber,
                        })
                      }
                    />
                  </Form.Group>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>

        <Card>
          <Card.Body className="shadow-lg" style={{ overflow: 'auto', maxHeight: '421px' }}>
            <div className="">
              <div className="">
                <h1>Ticket Details</h1>
                <p>(E-tickets movie details)</p>
                <hr />
              </div>
              <div className="mb-5">
                {savedResult.length > 0 ? (
                  savedResult.map((result, index) => (
                    <div key={index}>
                      <h6>{result.date}</h6>
                      {result.film && result.ticketAmount ? ( // Conditional rendering untuk judul dan jumlah tiket
                        <div className="d-flex gap-4">
                          <p>Judul : {result.film}</p>
                          <p>Tiket : {result.ticketAmount}</p>
                          <p>Harga Tiket : {result.ticketPrice}</p>
                          {/* Informasi lainnya yang ingin ditampilkan */}
                        </div>
                      ) : (
                        <p></p> // Pesan jika judul atau tiket kosong
                      )}
                    </div>
                  ))
                ) : (
                  <p>Tidak ada hasil yang disimpan.</p>
                )}
              </div>
              <div className="mt-5">
                <h6>Ringkasan Harian : </h6>
                <p>Total Tiket Penjualan : {totalTicketSold} </p>
                <p>Total Pendapatan : {totalDailyIncome} </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default App;
