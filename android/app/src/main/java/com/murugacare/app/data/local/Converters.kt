package com.murugacare.app.data.local

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.murugacare.app.data.local.entities.Milestone
import com.murugacare.app.data.local.entities.SubTask

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromSubTaskList(value: List<SubTask>?): String {
        return gson.toJson(value ?: emptyList<SubTask>())
    }

    @TypeConverter
    fun toSubTaskList(value: String): List<SubTask> {
        val listType = object : TypeToken<List<SubTask>>() {}.type
        return try {
            gson.fromJson(value, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromMilestoneList(value: List<Milestone>?): String {
        return gson.toJson(value ?: emptyList<Milestone>())
    }

    @TypeConverter
    fun toMilestoneList(value: String): List<Milestone> {
        val listType = object : TypeToken<List<Milestone>>() {}.type
        return try {
            gson.fromJson(value, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromIntList(value: List<Int>?): String {
        return gson.toJson(value ?: emptyList<Int>())
    }

    @TypeConverter
    fun toIntList(value: String): List<Int> {
        val listType = object : TypeToken<List<Int>>() {}.type
        return try {
            gson.fromJson(value, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromStringList(value: List<String>?): String {
        return gson.toJson(value ?: emptyList<String>())
    }

    @TypeConverter
    fun toStringList(value: String): List<String> {
        val listType = object : TypeToken<List<String>>() {}.type
        return try {
            gson.fromJson(value, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }
}
