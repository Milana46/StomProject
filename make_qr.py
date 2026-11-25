import socket
from pathlib import Path
import qrcode

root = Path(__file__).resolve().parent

def lan_ip():
    candidates = []
    for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
        ip = info[4][0]
        if ip.startswith("192.168.") or ip.startswith("10.") or ip.startswith("172."):
            candidates.append(ip)
    for ip in candidates:
        if ip.startswith("192.168."):
            return ip
    if candidates:
        return candidates[0]
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    return ip

ip = lan_ip()

url = f"http://{ip}:3000"
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=2)
qr.add_data(url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(root / "frotend" / "public" / "qr.png")
img.save(root / "QR-для-стенда.png")
print(url)
