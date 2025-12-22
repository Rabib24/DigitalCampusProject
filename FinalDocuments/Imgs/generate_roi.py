import matplotlib.pyplot as plt

years = [1, 2, 3, 4, 5]
costs = [50000, 20000, 15000, 15000, 15000]
benefits = [0, 10000, 40000, 60000, 80000]

plt.figure(figsize=(10, 6))
plt.plot(years, costs, marker='o', label='Costs ($)', color='red')
plt.plot(years, benefits, marker='o', label='Benefits ($)', color='green')

plt.title('Return on Investment (ROI) Analysis')
plt.xlabel('Year')
plt.ylabel('Amount ($)')
plt.grid(True)
plt.legend()

plt.savefig('roi_chart.png')
print("ROI Chart generated: roi_chart.png")
