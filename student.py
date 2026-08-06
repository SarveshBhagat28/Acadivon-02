class Student:
    def __init__(self, roll_no, name, marks):
        self.roll_no = roll_no
        self.name = name
        self.marks = marks

    def assign_grade(self):
        if self.marks >= 90:
            return "A"
        elif self.marks >= 75:
            return "B"
        elif self.marks >= 60:
            return "C"
        else:
            return "F"

    def display(self):
        print("Roll Number :", self.roll_no)
        print("Name :", self.name)
        print("Marks :", self.marks)
        print("Grade :", self.assign_grade())