class College:
    def __init__(self):
        self.students = []

    def add_student(self, student):
        self.students.append(student)

    def display_all(self):
        for student in self.students:
            student.display()
            print("-" * 30)