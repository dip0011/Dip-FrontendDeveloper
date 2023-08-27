const React = require('react');
const { render, screen, waitFor, fireEvent } = require('@testing-library/react');
const axios = require('axios');
const Capsules = require('../Capsules');

jest.mock('axios');
axios.get.mockResolvedValue({
  data: [
    {
        "capsule_serial": "C101",
        "capsule_id": "dragon1",
        "status": "retired",
        "original_launch": "2010-12-08T15:43:00.000Z",
        "original_launch_unix": 1291822980,
        "missions": [
            {
                "name": "COTS 1",
                "flight": 7
            }
        ],
        "landings": 1,
        "type": "Dragon 1.0",
        "details": "Reentered after three weeks in orbit",
        "reuse_count": 0
    },
    {
        "capsule_serial": "C102",
        "capsule_id": "dragon1",
        "status": "retired",
        "original_launch": "2012-05-22T07:44:00.000Z",
        "original_launch_unix": 1335944640,
        "missions": [
            {
                "name": "COTS 2",
                "flight": 8
            }
        ],
        "landings": 1,
        "type": "Dragon 1.0",
        "details": "First Dragon spacecraft",
        "reuse_count": 0
    },]
});

describe('Capsules Component', () => {
  it('renders without errors', async () => {
    render(<Capsules />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });
    expect(screen.getByText('CapsuleX Data')).toBeInTheDocument();
  });

  it('displays capsule data correctly', async () => {
    render(<Capsules />);
    await waitFor(() => {
      const capsules = screen.getAllByTestId('capsule-card');
      expect(capsules).toHaveLength(2); 
    });

    const firstCapsule = screen.getByText('C101');
    fireEvent.click(firstCapsule);

    await waitFor(() => {
      expect(screen.getByText('C101')).toBeInTheDocument();
      expect(screen.getByText('retired')).toBeInTheDocument();
    });
  });

});