class ItemMock {
  constructor(ir, {
    name, x, y, width, height
  } = {}) {
    this.ir = ir;
    this.Name = name;
    this.Text = name;
    this.X = x;
    this.Y = y;
    this.Width = width;
    this.Height = height;
  }
}

module.exports = ItemMock;
