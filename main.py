from student import Student
from college import College

college = College()

n = int(input("Enter number of students: "))

for i in range(n):
    print(f"\nStudent {i + 1}")

    roll_no = int(input("Enter roll number: "))
    name = input("Enter name: ")
    marks = float(input("Enter marks: "))

    student = Student(roll_no, name, marks)
    college.add_student(student)

print("\nStudent Details")
college.display_all()