import { render, screen, fireEvent } from "@testing-library/react";
import NewTicket from "../pages/tickets/new";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

test("Soumettre un ticket depuis le frontend", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({ ticket: { title: "Problème VPN" } })
  );

  render(<NewTicket />);

  fireEvent.change(screen.getByPlaceholderText("Expliquez votre demande..."), {
    target: { value: "Je n'arrive pas à me connecter au VPN" },
  });

  fireEvent.click(screen.getByText("Soumettre"));

  expect(fetchMock).toHaveBeenCalledWith(
    "http://localhost:3001/tickets",
    expect.objectContaining({
      method: "POST",
    })
  );

  expect(
    await screen.findByText("Ticket créé avec succès !")
  ).toBeInTheDocument();
});
