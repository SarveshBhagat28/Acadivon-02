from mobile import Mobile
from store import Store

store = Store()

n = int(input("Enter number of mobiles: "))

for i in range(n):
    print(f"\nMobile {i + 1}")

    brand = input("Enter brand: ")
    model = input("Enter model: ")
    price = float(input("Enter price: "))

    mobile = Mobile(brand, model, price)
    store.add_mobile(mobile)

print("\nMobile Details")
store.display_all()