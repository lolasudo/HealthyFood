const mongoose = require("mongoose");

async function clean() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/healthyfood");

    const collection = mongoose.connection.db.collection("users");

    try {
      await collection.dropIndex("username_1");
      console.log("✅ Индекс username_1 удалён");
    } catch {
      console.log("ℹ️ Индекс username_1 не найден или уже удалён");
    }

    const result = await collection.deleteMany({ username: null });
    console.log(`🧹 Удалено пользователей без username: ${result.deletedCount}`);

    await mongoose.disconnect();
    console.log("✅ Готово");
  } catch (err) {
    console.error("❌ Ошибка:", err.message);
  }
}

clean();
